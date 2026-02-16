import { useState } from "react";

export default function PaidToggle({ value, onChange }) {
    return (
        <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Paid</label>

            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative w-14 h-7 flex items-center rounded-full transition duration-300 
                ${value ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
            >
                <span
                    className={`absolute left-1 w-5 h-5 bg-[var(--color-secondary)] rounded-full shadow-md transform transition duration-300
                    ${value ? "translate-x-7" : ""}`}
                />
            </button>
        </div>
    );
}
