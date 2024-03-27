import React from "react";

export interface SelectState {
  value: string[];
  isFocused: boolean;
  showDropdown: boolean;
  dropdownProps: DropdownStyleProps;
  searchValue: string;
  currentOptionFocusValue: string;
  focusedChipIndex: number;
  controlled: boolean;
}

export type SelectAction =
  | SetSingleValue
  | UpdateMultipleValue
  | SetFocus
  | SetDropdownVisibility
  | SetSearchValue
  | SetOptionFocus
  | SetFocusedChip
  | SetDropdownStyles
  | SetControlledValue
  | ClearValue;

interface ClearValue {
  type: "CLEAR_VALUE";
}

interface SetSingleValue {
  type: "SET_SINGLE_VALUE";
  value: string;
}

interface SetControlledValue {
  type: "SET_CONTROLLED_VALUE";
  value: string[];
}

interface UpdateMultipleValue {
  type: "UPDATE_MULTIPLE_VALUE";
  value: string;
}

interface SetFocus {
  type: "SET_FOCUS";
  isFocused: boolean;
}

interface SetDropdownVisibility {
  type: "SET_DROPDOWN_VISIBILITY";
  showDropdown: boolean;
}

interface SetSearchValue {
  type: "SET_SEARCH_VALUE";
  searchValue: string;
}

interface SetOptionFocus {
  type: "SET_OPTION_FOCUS";
  value: string;
}

interface SetFocusedChip {
  type: "SET_FOCUSED_CHIP";
  focusedChipIndex: number;
}

interface SetDropdownStyles extends DropdownStyleProps {
  type: "SET_DROPDOWN_STYLES";
}

export interface DropdownStyleProps {
  drop: "down" | "up";
  style: object;
}

export interface SelectProps {
  selectWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  selectInputProps?: React.HTMLAttributes<HTMLInputElement>;
  searchInputProps?: React.HTMLAttributes<HTMLInputElement>;
  options: Options[];
  defaultValue?: string[];
  value?: string[];
  enableMultiple?: boolean;
  labelProps?: React.HTMLAttributes<HTMLLabelElement>;
  label?: string;
  placeholder?: string;
  getValue: (value: string[]) => void;
  enableSearch?: boolean;
  chipView?: boolean;
  chipViewEnableRemove?: boolean;
  renderOption?: (option: Options, isSelected: boolean) => JSX.Element;
  renderChip?: (props: CustomChipProps) => JSX.Element;
  dropdownOffset?: DropdownOffset;
  showPlaceholderInOptions?: boolean;
  enableValuesOutsideOfOptions?: boolean;
  searchIcon?: JSX.Element;
  renderDropDownIcon?: (props: DropDownIconProps) => JSX.Element;
  canClearValue?: boolean;
  customFilterMethod?: (value: string) => Options[];
  /**
   * Does not apply for chip view
   */
  showSelectedValue?: boolean;
}

export interface DropDownIconProps {
  isDropDownOpen: boolean;
}
export interface DropdownOffset {
  top: number;
  bottom: number;
}
export interface Options {
  optionProps?: React.HTMLAttributes<HTMLLIElement>;
  group?: boolean;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ChipListProps {
  values: Options[];
  originalValues: string[];
  chipViewEnableRemove: boolean;
  selectDispatch: React.Dispatch<SelectAction>;
  focusedChipIndex: number;
  controlled: boolean;
  getValue: (value: string[]) => void;
  renderChip?: (props: CustomChipProps) => JSX.Element;
  isFocused: boolean;
}

export interface CustomChipProps {
  option: Options;
  index: number;
  focusedChipIndex: number;
  isFocused: boolean;
}
export interface CheckBoxListProps {
  isSelected: boolean;
  label: string;
  showCheckBox: boolean;
}
