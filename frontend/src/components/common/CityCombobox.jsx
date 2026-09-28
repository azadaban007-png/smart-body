import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useCatalog } from "@/context/CatalogContext";

export const CityCombobox = ({ value, onChange, testId, labelId, invalid = false, placeholder = "شهر را انتخاب کنید", className = "" }) => {
  const { cities } = useCatalog();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-labelledby={labelId}
          aria-invalid={invalid}
          data-testid={testId}
          className={`flex w-full items-center justify-between gap-2 text-right ${className}`}
        >
          <span className={`truncate ${value ? "font-semibold text-sb-text" : "text-sb-muted"}`}>{value || placeholder}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-sb-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" dir="rtl" className="w-[var(--radix-popover-trigger-width)] min-w-[260px] overflow-hidden rounded-2xl border-sb-border p-0">
        <Command dir="rtl">
          <CommandInput placeholder="جستجوی شهر..." data-testid={`${testId}-search`} />
          <CommandList className="max-h-64">
            <CommandEmpty>شهری پیدا نشد</CommandEmpty>
            <CommandGroup>
              {cities.map((c) => (
                <CommandItem
                  key={c.slug}
                  value={c.name}
                  onSelect={() => {
                    onChange(c.name);
                    setOpen(false);
                  }}
                  data-testid={`city-option-${c.slug}`}
                  className="cursor-pointer gap-2 rounded-xl py-2.5"
                >
                  <Check className={`h-4 w-4 text-sb-primary ${value === c.name ? "opacity-100" : "opacity-0"}`} />
                  <span className="font-medium">{c.name}</span>
                  <span className="ms-auto text-xs text-sb-muted">{c.province}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
