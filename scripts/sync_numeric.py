import os
import re

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {path}")

prod_path = 'src/features/admin/ProductsPage.tsx'
with open(prod_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add NumericFormat imports
imports_to_add = """import { forwardRef } from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
"""
if "import { NumericFormat" not in content:
    content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\n" + imports_to_add)

numeric_format_custom = """
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.formattedValue,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp "
        allowNegative={false}
      />
    );
  },
);

export const ProductsPage = () => {"""

if "NumericFormatCustom" not in content:
    content = content.replace("export const ProductsPage = () => {", numeric_format_custom)

# Replace the text fields to use the NumericFormatCustom
old_min_price = """              <TextField
                name="minPrice"
                value={draftMinPrice}
                onChange={(e) => setDraftMinPrice(e.target.value)}
                label="Harga Minimum"
                type="number"
                size="small"
                sx={{ minWidth: 150, flex: { sm: 1 } }}
                error={!!priceError}
              />"""

new_min_price = """              <TextField
                name="minPrice"
                value={draftMinPrice}
                onChange={(e) => setDraftMinPrice(e.target.value)}
                label="Harga Minimum"
                size="small"
                sx={{ minWidth: 150, flex: { sm: 1 } }}
                error={!!priceError}
                slotProps={{
                  input: {
                    inputComponent: NumericFormatCustom as any,
                  },
                }}
              />"""

old_max_price = """              <TextField
                name="maxPrice"
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(e.target.value)}
                label="Harga Maksimum"
                type="number"
                size="small"
                sx={{ minWidth: 150, flex: { sm: 1 } }}
                error={!!priceError}
                helperText={priceError || " "}
              />"""

new_max_price = """              <TextField
                name="maxPrice"
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(e.target.value)}
                label="Harga Maksimum"
                size="small"
                sx={{ minWidth: 150, flex: { sm: 1 } }}
                error={!!priceError}
                helperText={priceError || " "}
                slotProps={{
                  input: {
                    inputComponent: NumericFormatCustom as any,
                  },
                }}
              />"""

content = content.replace(old_min_price, new_min_price)
content = content.replace(old_max_price, new_max_price)

# Also fix the validation logic in handleApplyFilter
# From `if (draftMinPrice) minPrice = parseInt(draftMinPrice);`
# To   `if (draftMinPrice) minPrice = parseInt(draftMinPrice.replace(/\D/g, ""));`
old_val = """    if (draftMinPrice) minPrice = parseInt(draftMinPrice);
    if (draftMaxPrice) maxPrice = parseInt(draftMaxPrice);"""
new_val = """    if (draftMinPrice) {
      const val = parseInt(draftMinPrice.replace(/\D/g, ""));
      if (!isNaN(val)) minPrice = val;
    }
    if (draftMaxPrice) {
      const val = parseInt(draftMaxPrice.replace(/\D/g, ""));
      if (!isNaN(val)) maxPrice = val;
    }"""
content = content.replace(old_val, new_val)

write_file(prod_path, content)
