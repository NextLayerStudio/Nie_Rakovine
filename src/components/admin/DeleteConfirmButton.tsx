"use client";

export function DeleteConfirmButton({
  action,
  id,
  label = "Zmazať",
  confirmText = "Naozaj chceš zmazať túto položku? Táto akcia je nezvratná.",
  className,
  extraFields,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
  className?: string;
  extraFields?: Record<string, string>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {extraFields &&
        Object.entries(extraFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <button
        type="submit"
        onClick={(e) => {
          if (!window.confirm(confirmText)) {
            e.preventDefault();
          }
        }}
        className={
          className ??
          "rounded border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        }
      >
        {label}
      </button>
    </form>
  );
}
