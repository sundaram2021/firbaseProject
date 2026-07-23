"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/actions/admin";

export type EditableProduct = {
  slug: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  priceInCents: number;
  currency: string;
  quantity: number;
};

export function ProductsEditor({ products }: { products: EditableProduct[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
            <th className="px-5 py-3 font-semibold">Product</th>
            <th className="px-5 py-3 font-semibold">Price (₹)</th>
            <th className="px-5 py-3 font-semibold">Stock</th>
            <th className="px-5 py-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <EditorRow key={p.slug} product={p} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditorRow({ product }: { product: EditableProduct }) {
  const router = useRouter();
  const initialPrice = Math.round(product.priceInCents / 100);
  const [price, setPrice] = useState(String(initialPrice));
  const [qty, setQty] = useState(String(product.quantity));
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dirty = Number(price) !== initialPrice || Number(qty) !== product.quantity;

  const save = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await updateProduct(product.slug, {
        priceInRupees: Number(price),
        quantity: Number(qty),
      });
      if (res.ok) {
        setMsg({ ok: true, text: "Saved" });
        router.refresh();
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  };

  const inputCls =
    "h-10 w-28 rounded-lg border border-ink/15 bg-white px-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

  return (
    <tr className="border-b border-ink/[0.06] last:border-0">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <p className="font-medium text-ink">{product.title}</p>
            <p className="text-xs text-ink/50">
              {product.brand} · {product.category}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputCls}
          aria-label={`Price for ${product.title}`}
        />
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          min={0}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className={inputCls}
          aria-label={`Stock for ${product.title}`}
        />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          {msg && (
            <span className={`text-xs font-medium ${msg.ok ? "text-green-600" : "text-brand-600"}`}>
              {msg.text}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}
