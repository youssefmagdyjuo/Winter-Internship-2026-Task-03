import React, { forwardRef } from 'react';

const Input = forwardRef(({
    placeholder,
    value,
    onChange,
    type = "text",
    accept,
    multiple,
    name,
    style,
    id,
    list,
    required,
    checked
}, ref) => {
    return (
        <input
        
            ref={ref}
            className="input"
            type={type}
            accept={accept}
            multiple={multiple}
            placeholder={placeholder}
            value={type !== 'file' ? value ?? '' : undefined}
            onChange={onChange}
            name={name}
            style={style}
            id={id}
            list={list}
            required={required}
            checked={checked}
        />
    );
});

export default Input;
