"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { createProduct, updateProduct } from "@/lib/admin/actions/product-actions";
import { uploadProductImage } from "@/lib/admin/actions/upload-product-image";
import type { ProductCategory, ProductDetail, ProductFormPayload, ProductMediaInput, ProductVariantInput } from "@/lib/admin/products/types";
import { validateProductPayload, type ProductValidationError } from "@/lib/admin/products/validate-product";

const CATEGORY_OPTIONS: readonly { value: ProductCategory; label: string }[] = [
  { value: "clothing", label: "Clothing" },
  { value: "fragrance", label: "Fragrance" },
  { value: "beauty-hair-care", label: "Beauty & Hair Care" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankVariant(): ProductVariantInput {
  return {
    sku: "",
    variantLabel: null,
    size: null,
    color: null,
    volume: null,
    priceMinor: null,
    compareAtPriceMinor: null,
    active: false,
    quantityAvailable: 0,
    lowStockThreshold: null,
  };
}

function deriveVariantLabel(size: string | null, color: string | null, volume: string | null): string | null {
  const parts = [color, size, volume].filter((part): part is string => Boolean(part && part.trim().length > 0));
  return parts.length > 0 ? parts.join(" / ") : null;
}

function toLines(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toRupees(minor: number | null): string {
  return minor === null ? "" : String(minor / 100);
}

function fromRupees(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const rupees = Number(trimmed);
  if (!Number.isFinite(rupees) || rupees < 0) return null;
  return Math.round(rupees * 100);
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: ProductDetail;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? "clothing");
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [shortDescription, setShortDescription] = useState(product?.attributes.shortDescription ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [active, setActive] = useState(product?.active ?? false);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription ?? "");

  const [fabric, setFabric] = useState(product?.attributes.fabric ?? "");
  const [careInstructions, setCareInstructions] = useState((product?.attributes.careInstructions ?? []).join("\n"));
  const [sizeGuide, setSizeGuide] = useState(product?.attributes.sizeGuide ?? "");
  const [scentDescription, setScentDescription] = useState(product?.attributes.scentDescription ?? "");
  const [ingredients, setIngredients] = useState((product?.attributes.ingredients ?? []).join("\n"));
  const [usageInstructions, setUsageInstructions] = useState((product?.attributes.usageInstructions ?? []).join("\n"));
  const [warnings, setWarnings] = useState((product?.attributes.warnings ?? []).join("\n"));

  const [variants, setVariants] = useState<ProductVariantInput[]>(product?.variants.length ? [...product.variants] : [blankVariant()]);
  const [media, setMedia] = useState<ProductMediaInput[]>(product?.media.length ? [...product.media] : []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<readonly ProductValidationError[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  function errorFor(field: string): string | undefined {
    return fieldErrors.find((error) => error.field === field)?.message;
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function updateVariant(index: number, patch: Partial<ProductVariantInput>) {
    setVariants((current) =>
      current.map((variant, i) => {
        if (i !== index) return variant;
        const next = { ...variant, ...patch };
        if ("size" in patch || "color" in patch || "volume" in patch) {
          next.variantLabel = deriveVariantLabel(next.size, next.color, next.volume);
        }
        return next;
      }),
    );
  }

  function removeVariant(index: number) {
    setVariants((current) => current.filter((_, i) => i !== index));
  }

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setFormError(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadProductImage(formData);

        if (result.status === "error") {
          setFormError(result.message);
          continue;
        }

        setMedia((current) => [...current, { url: result.url, alt: title || "Product image", role: current.length === 0 ? "primary" : "gallery", position: current.length }]);
      }
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function makePrimary(index: number) {
    setMedia((current) => {
      const target = current[index];
      const rest = current.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  }

  function removeMedia(index: number) {
    setMedia((current) => current.filter((_, i) => i !== index));
  }

  function buildPayload(): ProductFormPayload {
    return {
      slug,
      title,
      category,
      subcategory: subcategory.trim() || null,
      description: description.trim() || null,
      active,
      featured,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      attributes: {
        shortDescription: shortDescription.trim() || undefined,
        ...(category === "clothing"
          ? { fabric: fabric.trim() || undefined, careInstructions: toLines(careInstructions), sizeGuide: sizeGuide.trim() || undefined }
          : {}),
        ...(category === "fragrance" ? { scentDescription: scentDescription.trim() || undefined } : {}),
        ...(category === "beauty-hair-care"
          ? { ingredients: toLines(ingredients), usageInstructions: toLines(usageInstructions), warnings: toLines(warnings) }
          : {}),
      },
      variants,
      media: media.map((item, index) => ({ ...item, role: index === 0 ? "primary" : "gallery", position: index })),
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const payload = buildPayload();
    const errors = validateProductPayload(payload);
    setFieldErrors(errors);
    if (errors.length > 0) {
      setFormError("Fix the highlighted fields below.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = mode === "create" ? await createProduct(payload) : await updateProduct(product!.id, payload);

      if (result.status === "error") {
        setFormError(result.message);
        setFieldErrors(result.fieldErrors ?? []);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {formError && (
        <p className="admin-notice" role="alert">
          {formError}
        </p>
      )}

      <section className="admin-form-section">
        <h2>Product</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="title">Product Name</label>
            <input id="title" onChange={(event) => handleTitleChange(event.target.value)} required value={title} />
            {errorFor("title") && <p className="checkout-field__error">{errorFor("title")}</p>}
          </div>
          <div className="admin-field">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
              required
              value={slug}
            />
            {errorFor("slug") && <p className="checkout-field__error">{errorFor("slug")}</p>}
          </div>
          <div className="admin-field">
            <label htmlFor="category">Category</label>
            <select id="category" onChange={(event) => setCategory(event.target.value as ProductCategory)} value={category}>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="subcategory">Subcategory</label>
            <input id="subcategory" onChange={(event) => setSubcategory(event.target.value)} value={subcategory} />
          </div>
        </div>

        <div className="admin-form-grid" data-cols="1">
          <div className="admin-field">
            <label htmlFor="shortDescription">Short Description</label>
            <textarea id="shortDescription" onChange={(event) => setShortDescription(event.target.value)} value={shortDescription} />
          </div>
          <div className="admin-field">
            <label htmlFor="description">Full Description</label>
            <textarea id="description" onChange={(event) => setDescription(event.target.value)} value={description} />
          </div>
        </div>

        <div className="admin-form-grid">
          <label className="admin-checkbox">
            <input checked={active} onChange={(event) => setActive(event.target.checked)} type="checkbox" />
            Active (visible and purchasable on the storefront)
          </label>
          <label className="admin-checkbox">
            <input checked={featured} onChange={(event) => setFeatured(event.target.checked)} type="checkbox" />
            Featured
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>SEO</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="seoTitle">SEO Title</label>
            <input id="seoTitle" onChange={(event) => setSeoTitle(event.target.value)} value={seoTitle} />
          </div>
          <div className="admin-field">
            <label htmlFor="seoDescription">SEO Description</label>
            <input id="seoDescription" onChange={(event) => setSeoDescription(event.target.value)} value={seoDescription} />
          </div>
        </div>
      </section>

      {category === "clothing" && (
        <section className="admin-form-section">
          <h2>Clothing Details</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="fabric">Fabric / Material</label>
              <input id="fabric" onChange={(event) => setFabric(event.target.value)} value={fabric} />
            </div>
          </div>
          <div className="admin-form-grid" data-cols="1">
            <div className="admin-field">
              <label htmlFor="careInstructions">Care Instructions (one per line)</label>
              <textarea id="careInstructions" onChange={(event) => setCareInstructions(event.target.value)} value={careInstructions} />
            </div>
            <div className="admin-field">
              <label htmlFor="sizeGuide">Size Guide / Measurements</label>
              <textarea id="sizeGuide" onChange={(event) => setSizeGuide(event.target.value)} value={sizeGuide} />
            </div>
          </div>
        </section>
      )}

      {category === "fragrance" && (
        <section className="admin-form-section">
          <h2>Fragrance Details</h2>
          <div className="admin-form-grid" data-cols="1">
            <div className="admin-field">
              <label htmlFor="scentDescription">Scent Description</label>
              <textarea id="scentDescription" onChange={(event) => setScentDescription(event.target.value)} value={scentDescription} />
            </div>
          </div>
        </section>
      )}

      {category === "beauty-hair-care" && (
        <section className="admin-form-section">
          <h2>Beauty &amp; Hair Care Details</h2>
          <div className="admin-form-grid" data-cols="1">
            <div className="admin-field">
              <label htmlFor="ingredients">Ingredients (one per line, if supplied)</label>
              <textarea id="ingredients" onChange={(event) => setIngredients(event.target.value)} value={ingredients} />
            </div>
            <div className="admin-field">
              <label htmlFor="usageInstructions">Usage Instructions (one per line)</label>
              <textarea id="usageInstructions" onChange={(event) => setUsageInstructions(event.target.value)} value={usageInstructions} />
            </div>
            <div className="admin-field">
              <label htmlFor="warnings">Warnings (one per line, if supplied)</label>
              <textarea id="warnings" onChange={(event) => setWarnings(event.target.value)} value={warnings} />
            </div>
          </div>
        </section>
      )}

      <section className="admin-form-section">
        <h2>Variants &amp; Stock</h2>
        {errorFor("variants") && <p className="checkout-field__error">{errorFor("variants")}</p>}
        {variants.map((variant, index) => (
          <div className="admin-variant-row" key={variant.id ?? index}>
            <div className="admin-variant-row__grid">
              <div className="admin-field">
                <label htmlFor={`variant-sku-${index}`}>SKU</label>
                <input id={`variant-sku-${index}`} onChange={(event) => updateVariant(index, { sku: event.target.value })} value={variant.sku} />
                {errorFor(`variants.${index}.sku`) && <p className="checkout-field__error">{errorFor(`variants.${index}.sku`)}</p>}
              </div>
              {category === "clothing" && (
                <>
                  <div className="admin-field">
                    <label htmlFor={`variant-size-${index}`}>Size</label>
                    <input id={`variant-size-${index}`} onChange={(event) => updateVariant(index, { size: event.target.value || null })} value={variant.size ?? ""} />
                  </div>
                  <div className="admin-field">
                    <label htmlFor={`variant-color-${index}`}>Color</label>
                    <input id={`variant-color-${index}`} onChange={(event) => updateVariant(index, { color: event.target.value || null })} value={variant.color ?? ""} />
                  </div>
                </>
              )}
              {category !== "clothing" && (
                <div className="admin-field">
                  <label htmlFor={`variant-volume-${index}`}>Volume</label>
                  <input id={`variant-volume-${index}`} onChange={(event) => updateVariant(index, { volume: event.target.value || null })} value={variant.volume ?? ""} />
                </div>
              )}
              <div className="admin-field">
                <label htmlFor={`variant-price-${index}`}>Price (PKR)</label>
                <input
                  id={`variant-price-${index}`}
                  inputMode="decimal"
                  onChange={(event) => updateVariant(index, { priceMinor: fromRupees(event.target.value) })}
                  value={toRupees(variant.priceMinor)}
                />
                {errorFor(`variants.${index}.priceMinor`) && <p className="checkout-field__error">{errorFor(`variants.${index}.priceMinor`)}</p>}
              </div>
              <div className="admin-field">
                <label htmlFor={`variant-compare-${index}`}>Compare-at Price (PKR)</label>
                <input
                  id={`variant-compare-${index}`}
                  inputMode="decimal"
                  onChange={(event) => updateVariant(index, { compareAtPriceMinor: fromRupees(event.target.value) })}
                  value={toRupees(variant.compareAtPriceMinor)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`variant-stock-${index}`}>Stock</label>
                <input
                  id={`variant-stock-${index}`}
                  inputMode="numeric"
                  onChange={(event) => updateVariant(index, { quantityAvailable: Number(event.target.value) || 0 })}
                  value={variant.quantityAvailable}
                />
                {errorFor(`variants.${index}.quantityAvailable`) && <p className="checkout-field__error">{errorFor(`variants.${index}.quantityAvailable`)}</p>}
              </div>
              <div className="admin-field">
                <label htmlFor={`variant-low-stock-${index}`}>Low Stock Threshold</label>
                <input
                  id={`variant-low-stock-${index}`}
                  inputMode="numeric"
                  onChange={(event) => updateVariant(index, { lowStockThreshold: event.target.value ? Number(event.target.value) : null })}
                  value={variant.lowStockThreshold ?? ""}
                />
              </div>
            </div>
            <p className="admin-field__hint">Option label: {variant.variantLabel ?? "— (single variant)"}</p>
            <label className="admin-checkbox">
              <input checked={variant.active} onChange={(event) => updateVariant(index, { active: event.target.checked })} type="checkbox" />
              Active (purchasable once priced and in stock)
            </label>
            {variants.length > 1 && (
              <button className="admin-button admin-variant-row__remove" onClick={() => removeVariant(index)} type="button">
                Remove Variant
              </button>
            )}
          </div>
        ))}
        <button className="admin-button" onClick={() => setVariants((current) => [...current, blankVariant()])} type="button">
          Add Variant
        </button>
      </section>

      <section className="admin-form-section">
        <h2>Images</h2>
        <div className="admin-field">
          <label htmlFor="media-upload">Upload Images</label>
          <input accept="image/jpeg,image/png,image/webp,image/avif" disabled={isUploading} id="media-upload" multiple onChange={handleFileSelect} type="file" />
          <p className="admin-field__hint">{isUploading ? "Uploading…" : "JPEG, PNG, WEBP, or AVIF, up to 5MB each. First image is the primary image."}</p>
        </div>
        {media.length > 0 && (
          <div className="admin-media-grid">
            {media.map((item, index) => (
              <div className="admin-media-tile" data-primary={index === 0} key={item.url}>
                <Image alt={item.alt} height={140} src={item.url} unoptimized width={140} />
                {index === 0 && <span className="admin-media-tile__label">Primary</span>}
                <div className="admin-media-tile__actions">
                  {index !== 0 && (
                    <button onClick={() => makePrimary(index)} type="button">
                      Make Primary
                    </button>
                  )}
                  <button onClick={() => removeMedia(index)} type="button">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="admin-form-actions">
        <button className="admin-button admin-button--primary" disabled={isSubmitting || isUploading} type="submit">
          {isSubmitting ? "Saving…" : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button className="admin-button admin-button--secondary" onClick={() => router.push("/admin/products")} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}
