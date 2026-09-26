"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.css";

export function Dropdown({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div className={`${styles.dropdown} ${className}`} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={`${ariaLabel.replaceAll(" ", "-").toLowerCase()}-options`}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected.label}</span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <div
          className={styles.menu}
          id={`${ariaLabel.replaceAll(" ", "-").toLowerCase()}-options`}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={option.value === value ? styles.selected : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              key={option.value}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
