type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function SearchInput(props: Props) {
  return (
    <div className="relative">
      <input
        {...props}
        className={[
          "w-[260px] sm:w-[320px]",
          "rounded-2xl border border-ink-200 bg-white",
          "px-4 py-2.5 text-sm outline-none",
          "focus:ring-4 focus:ring-brand-100 focus:border-brand-400",
          props.className || "",
        ].join(" ")}
      />
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 text-xs">
        ⌘K
      </div>
    </div>
  );
}
