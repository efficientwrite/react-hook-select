# React-hook-select

A react select component using hooks & typescript.

## Installation and usage

```
yarn add react-hook-select
```

```js
import React from "react";
import ReactHookSelect from "react-hook-select";

function App() {
  return (
    <ReactHookSelect
      label="select"
      enableMultiple={true}
      enableSearch={false}
      placeholder={"choose option"}
      defaultValue={[]}
      options={[
        { label: "Group A", value: "Group A", group: true },
        { label: "a", value: "a" },
        { label: "Group B", value: "Group B", group: true },
        { label: "b", value: "b" },
      ]}
    />
  );
}
```

Use SCSS file directly and can override variables.

```js
import "react-hook-select/index.scss";
```

### Props

- `selectWrapperProps`: All props applicable to DIV element.
- `selectInputProps`: All props applicable to Input element.
- `searchInputProps`: All props applicable to Input element.
- `options`: Array of options, with possible values - label, value, disabled, group, optionProps - attributes set to li element.
- `defaultValue`: Array of string(for single/multiple select), default value.
- `value`: Array of string(for single/multiple select), provide to be a controlled component.
- `enableMultiple`: Should enable selecting multiple options.
- `labelProps`: All props applicable to label element.
- `label`: Label for the select element.
- `placeholder`: Placeholder for the select element.
- `getValue`: Callback function returning array of values.
- `enableSearch`: Should enable options search.
- `chipView`: Should show selected values as a chip, only for multi select.
- `chipViewEnableRemove`: For chip view, enable showing close icon.
- `renderOption`: Custom render function for option.
- `renderChip`: Custom render function for chip.
- `dropdownOffset`: Can provide two values top and bottom which specifies the gap between the top and bottom edge of screen and the select option wrapper.
- `showPlaceholderInOptions`: Can enable/disable placeholder to be shown in list of options too
- `enableValuesOutsideOfOptions`: Normal cases, only if the value is present in options it will be shown, this can be enabled to show even if option is not present in the list passed.
- `searchIcon`: Icon for input box when search enabled.
- `renderDropDownIcon`: Provide a custom dropdown icon instead of default.
- `canClearValue`: Ability to clear selected value by showing 'X' icon to clear.
