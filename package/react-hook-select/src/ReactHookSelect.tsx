import React, { useCallback, useEffect, useReducer, useRef, useMemo } from "react";
import { CheckBoxListProps, ChipListProps, Options, SelectAction, SelectProps, SelectState } from "./typings";

enum SELECT_ACTIONS {
  SET_SINGLE_VALUE = 'SET_SINGLE_VALUE',
  UPDATE_MULTIPLE_VALUE = 'UPDATE_MULTIPLE_VALUE',
  SET_FOCUS = 'SET_FOCUS',
  SET_DROPDOWN_VISIBILITY = 'SET_DROPDOWN_VISIBILITY',
  SET_DROPDOWN_STYLES = 'SET_DROPDOWN_STYLES',
  SET_SEARCH_VALUE = 'SET_SEARCH_VALUE',
  SET_OPTION_FOCUS = 'SET_OPTION_FOCUS',
  SET_FOCUSED_CHIP = 'SET_FOCUSED_CHIP',
  SET_CONTROLLED_VALUE = 'SET_CONTROLLED_VALUE'
}

function updateMultipleValue(values: string[], newValue: string) {
  const isOptionAvailable = values.includes(newValue);
  return isOptionAvailable
    ? values.filter((val) => val !== newValue)
    : [...values, newValue]
}

function selectReducer(state: SelectState, action: SelectAction) {
  switch (action.type) {
    case SELECT_ACTIONS.SET_SINGLE_VALUE:
      return { ...state, value: [action.value] };
    case SELECT_ACTIONS.UPDATE_MULTIPLE_VALUE:
      return {
        ...state,
        value: updateMultipleValue(state.value, action.value),
      };
    case SELECT_ACTIONS.SET_CONTROLLED_VALUE:
      return {
        ...state,
        value: action.value,
      };
    case SELECT_ACTIONS.SET_FOCUS:
      return { ...state, isFocused: action.isFocused };
    case SELECT_ACTIONS.SET_DROPDOWN_VISIBILITY:
      return { ...state, showDropdown: action.showDropdown };
    case SELECT_ACTIONS.SET_DROPDOWN_STYLES:
      return {
        ...state,
        dropdownProps: { style: action.style, drop: action.drop },
      };
    case SELECT_ACTIONS.SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.searchValue,
      };
    case SELECT_ACTIONS.SET_OPTION_FOCUS:
      return {
        ...state,
        currentOptionFocusValue: action.value,
      };
    case SELECT_ACTIONS.SET_FOCUSED_CHIP:
      return {
        ...state,
        focusedChipIndex: action.focusedChipIndex,
      };
    default:
      return state;
  }
}

function RenderOptionWithCheckbox(props: CheckBoxListProps) {
  const { isSelected, label, showCheckBox } = props;
  return (
    <>
      {showCheckBox && (
        <div
          className={`checkbox-icon ${isSelected ? "checked" : ""}`.trim()}
        />
      )}
      <span>{label}</span>
    </>
  );
}

function ChipList(props: ChipListProps) {
  const { originalValues, values, chipViewEnableRemove, selectDispatch, focusedChipIndex, controlled, getValue } =
    props;
  return (
    <>
      {values.map((value, index) => {
        return (
          <div
            key={value.value}
            className={`chip-view ${focusedChipIndex === index ? "focus" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span>{value.label}</span>
            {chipViewEnableRemove && (
              <span
                className="chip-remove"
                onClick={() => {
                  if (controlled) {
                    getValue(updateMultipleValue(originalValues, value.value))
                  } else {
                    selectDispatch({ type: SELECT_ACTIONS.UPDATE_MULTIPLE_VALUE, value: value.value });
                  }
                }}
              />
            )}
          </div>
        );
      })}
    </>
  )
}

function ReactHookSelect(props: SelectProps) {
  const {
    selectWrapperProps = {},
    selectInputProps = {},
    searchInputProps = {},
    options = [],
    defaultValue,
    enableMultiple = false,
    labelProps = {},
    label = "",
    placeholder = "",
    getValue = () => { },
    enableSearch = false,
    chipView = true,
    chipViewEnableRemove = true,
    renderOption,
    value,
  } = props;

  const {
    className: sCN = "",
    onFocus: onInputSelectFocus,
    onBlur: onInputSelectBlur,
    onKeyDown: onInputSelectonKeyDown,
    onClick: onInputSelectonClick,
    ...remainingSIP
  } = selectInputProps;
  const { className: lCN = "", ...remainingLP } = labelProps;
  const { className: sWCN = "", ...remainingSWP } = selectWrapperProps;
  const {
    className: sICN = "",
    onChange: searchInputOnChange,
    ...remaingSearchInputProps
  } = searchInputProps;

  const [selectState, selectDispatch] = useReducer(selectReducer, {
    value: Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [],
    isFocused: false,
    showDropdown: false,
    dropdownProps: { drop: "down", style: {} },
    searchValue: "",
    currentOptionFocusValue: "",
    focusedChipIndex: -1,
    controlled: value !== undefined
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionWrapperRef = useRef<HTMLUListElement>(null);
  const mounted = useRef<boolean>(false);

  const optionsWithFilter = useMemo(
    () => getFilteredOptions(options, selectState.searchValue),
    [options, selectState.searchValue]
  );

  const { valuesWithinOptions, chipValues } = options.reduce((value, option) => {
    if (selectState.value.indexOf(option.value) !== -1) {
      return { valuesWithinOptions: [...value.valuesWithinOptions, option.label], chipValues: [...value.chipValues, option] }
    }
    return value
  }, { valuesWithinOptions: [] as string[], chipValues: [] as Options[] })

  const showPlaceholder = selectState.value.length === 0 && !label;
  const isChipView = enableMultiple && chipView && !showPlaceholder;

  function beforeDropdownOpen() {
    const positionValues = selectRef.current?.getBoundingClientRect();
    if (positionValues) {
      const availableTopSpace = positionValues?.top;
      const availableBottomSpace =
        window.innerHeight - positionValues?.top - positionValues?.height;
      selectDispatch({
        type: SELECT_ACTIONS.SET_DROPDOWN_STYLES,
        drop: availableBottomSpace >= availableTopSpace ? "down" : "up",
        style: {
          maxHeight: Math.max(availableBottomSpace, availableTopSpace) - 10,
        },
      });
    }
  }

  function toggleDropDown(show: boolean, notUpdateFocus = false) {
    if (show) {
      beforeDropdownOpen();
    } else {
      if (enableSearch) {
        selectDispatch({
          type: SELECT_ACTIONS.SET_SEARCH_VALUE,
          searchValue: "",
        });
      }
      selectDispatch({
        type: SELECT_ACTIONS.SET_FOCUSED_CHIP,
        focusedChipIndex: -1,
      });
    }
    selectDispatch({
      type: SELECT_ACTIONS.SET_DROPDOWN_VISIBILITY,
      showDropdown: show !== undefined ? show : !selectState.showDropdown,
    });
    if (!notUpdateFocus) {
      selectDispatch({
        type: SELECT_ACTIONS.SET_FOCUS,
        isFocused: show !== undefined ? show : !selectState.isFocused,
      });
      if (!selectState.isFocused && inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  function handleClickOutside(event: any) {
    if (
      selectRef.current &&
      !selectRef.current?.contains(event.target) &&
      selectState.showDropdown
    ) {
      toggleDropDown(false);
    }
  }

  useEffect(() => {
    if (selectState.controlled && mounted.current) {
      selectDispatch({ type: SELECT_ACTIONS.SET_CONTROLLED_VALUE, value: value! })
    }
  }, [value, selectState.controlled]);

  useEffect(() => {
    if (!selectState.controlled && mounted.current) {
      getValue(selectState.value);
    }
    mounted.current = true
  }, [selectState.value, selectState.controlled]);

  useEffect(() => {
    if (selectState.showDropdown) {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
    // eslint-disable-next-line
  }, [selectRef, selectState.showDropdown]);

  function onFocus(event: any) {
    if (onInputSelectFocus) {
      onInputSelectFocus(event);
    }
    selectDispatch({ type: SELECT_ACTIONS.SET_FOCUS, isFocused: true });
  }

  function onBlur(event: any) {
    if (onInputSelectBlur) {
      onInputSelectBlur(event);
    }
    if (!selectState.showDropdown) {
      selectDispatch({ type: SELECT_ACTIONS.SET_FOCUS, isFocused: false });
    }
    selectDispatch({
      type: SELECT_ACTIONS.SET_FOCUSED_CHIP,
      focusedChipIndex: -1,
    });
  }

  function handleSelectDropdownVisibility(newValue: boolean) {
    if (newValue) {
      beforeDropdownOpen();
    } else {
      selectDispatch({
        type: SELECT_ACTIONS.SET_OPTION_FOCUS,
        value: "",
      });
      selectDispatch({
        type: SELECT_ACTIONS.SET_SEARCH_VALUE,
        searchValue: "",
      });
    }
    selectDispatch({
      type: SELECT_ACTIONS.SET_DROPDOWN_VISIBILITY,
      showDropdown: newValue,
    });
  }

  function onKeyDown(event: any) {
    if (onInputSelectonKeyDown) {
      onInputSelectonKeyDown(event);
    }
    const keyCode = event.keyCode;
    if (keyCode === 13 || keyCode === 32) {
      if (keyCode === 32) {
        event.preventDefault()
      }
      const newValue = !selectState.showDropdown;
      if ((enableMultiple && newValue) || !enableMultiple) {
        toggleDropDown(newValue, true)
      }
      if (keyCode === 13 && selectState.showDropdown) {
        if (selectState.currentOptionFocusValue !== "") {
          setValue(selectState.currentOptionFocusValue);
        }
      }
    } else if (keyCode === 27 || (keyCode === 9 && selectState.showDropdown)) {
      if (keyCode === 9 && selectState.showDropdown) {
        event.preventDefault();
      }
      // tab key condition and escape
      toggleDropDown(false, true);
    } else if (keyCode === 38 || keyCode === 40) {
      handleOptionsNavigationByArrow(keyCode);
    } else if (keyCode === 8 && selectState.value.length > 0 && isChipView) {
      if (selectState.focusedChipIndex !== -1) {
        const valueToRemove = selectState.value[selectState.focusedChipIndex]
        if (selectState.controlled) {
          getValue(updateMultipleValue(selectState.value, valueToRemove))
        } else {
          selectDispatch({
            type: SELECT_ACTIONS.UPDATE_MULTIPLE_VALUE,
            value: valueToRemove,
          });
        }
        selectDispatch({
          type: SELECT_ACTIONS.SET_FOCUSED_CHIP,
          focusedChipIndex: -1,
        });
      } else {
        const valueToRemove = selectState.value[selectState.value.length - 1]
        if (selectState.controlled) {
          getValue(updateMultipleValue(selectState.value, valueToRemove))
        } else {
          selectDispatch({
            type: SELECT_ACTIONS.UPDATE_MULTIPLE_VALUE,
            value: valueToRemove,
          });
        }
      }
    } else if ((keyCode === 37 || (keyCode === 39 && isChipView)) && chipViewEnableRemove) {
      const totalLength = selectState.value.length;
      selectDispatch({
        type: SELECT_ACTIONS.SET_FOCUSED_CHIP,
        focusedChipIndex:
          keyCode === 37
            ? selectState.focusedChipIndex === -1
              ? totalLength - 1
              : selectState.focusedChipIndex - 1 >= 0
                ? selectState.focusedChipIndex - 1
                : selectState.focusedChipIndex
            : keyCode === 39
              ? selectState.focusedChipIndex === -1
                ? -1
                : selectState.focusedChipIndex + 1 <= totalLength - 1
                  ? selectState.focusedChipIndex + 1
                  : -1
              : -1,
      });
    } else if (![9].includes(keyCode)) {
      // not run for tab key condition
      event.preventDefault();
    }
  }

  function setValue(value: string, event?: any) {
    if (enableMultiple) {
      if (event !== undefined) {
        event.stopPropagation();
      }
      if (selectState.controlled) {
        getValue(updateMultipleValue(selectState.value, value));
      } else {
        selectDispatch({
          type: SELECT_ACTIONS.UPDATE_MULTIPLE_VALUE,
          value,
        });
      }
    } else {
      if (selectState.controlled) {
        getValue([value]);
      } else {
        selectDispatch({ type: SELECT_ACTIONS.SET_SINGLE_VALUE, value });
      }
      toggleDropDown(false, true);
    }
  }

  function onClick(event: any) {
    if (
      event.target === selectRef?.current ||
      event.target === inputRef?.current ||
      event.target.classList.contains("select-value-wrapper")
    ) {
      if (!enableSearch) {
        const toShowDropDown = !selectState.showDropdown;
        toggleDropDown(toShowDropDown);
        if (toShowDropDown && inputRef.current) {
          inputRef.current.focus();
        } else {
          selectDispatch({ type: SELECT_ACTIONS.SET_FOCUS, isFocused: false });
        }
      } else {
        const value =
          selectState.isFocused && !selectState.showDropdown
            ? true
            : !(selectState.isFocused && selectState.showDropdown);
        toggleDropDown(value);
      }
    }
  }

  function searchOptions(event: any) {
    const value = event.target.value.replace(/\\/g, '\\');
    if (searchInputOnChange) {
      searchInputOnChange(value);
    }
    const filteredOptions = options.filter((option) =>
      option.label.match(value)
    );
    selectOption(filteredOptions);
    selectDispatch({ type: SELECT_ACTIONS.SET_SEARCH_VALUE, searchValue: value });
  }

  function selectOption(options: Options[]) {
    const optionToFocus = options.find(
      (option) => !option.group && !option.disabled
    );
    if (optionWrapperRef?.current) {
      optionWrapperRef.current.scrollTop = 0;
    }
    if (optionToFocus !== undefined) {
      selectDispatch({
        type: SELECT_ACTIONS.SET_OPTION_FOCUS,
        value: optionToFocus.value,
      });
    }
  }

  function getScrollPosition(nextOption: Options, isUpKey: boolean): number | undefined {
    if (optionWrapperRef.current) {
      const scrolledValue = optionWrapperRef.current?.scrollTop;
      const scrollPosition =
        optionWrapperRef.current?.clientHeight + scrolledValue;
      const targetElement = document.querySelector(
        `li[data-value="${String(nextOption.value)}"]`
      ) as HTMLElement;
      const targetScrollPosition =
        targetElement?.offsetTop + targetElement?.clientHeight;
      if (
        (isUpKey && targetScrollPosition < scrollPosition) ||
        (!isUpKey && targetScrollPosition > scrollPosition)
      ) {
        return scrolledValue + targetScrollPosition - scrollPosition;
      } else {
        return scrolledValue;
      }
    }
  }

  function handleOptionsNavigationByArrow(keyCode: number) {
    const isUpKey = keyCode === 38;
    const currentOptionFocusIndex = optionsWithFilter.findIndex(
      (option) => option.value === selectState.currentOptionFocusValue
    );
    const optionsList = isUpKey
      ? optionsWithFilter.slice(0, currentOptionFocusIndex).reverse()
      : optionsWithFilter;
    const nextOption = optionsList.find((option, index) => {
      return (
        !option.disabled &&
        !option.group &&
        ((isUpKey && index < currentOptionFocusIndex) ||
          index > currentOptionFocusIndex)
      );
    });
    if (nextOption !== undefined) {
      if (optionWrapperRef?.current) {
        const scrollPosition = getScrollPosition(nextOption, isUpKey);
        if (scrollPosition) {
          optionWrapperRef.current.scrollTop = scrollPosition;
        }
      }
      selectDispatch({
        type: SELECT_ACTIONS.SET_OPTION_FOCUS,
        value: nextOption.value,
      });
    } else {
      selectOption(optionsWithFilter);
    }
  }

  function onSearchInputKeyDown(event: any) {
    const keyCode = event.keyCode;
    if (keyCode === 38 || keyCode === 40) {
      handleOptionsNavigationByArrow(keyCode);
      event.preventDefault();
    } else if (keyCode === 13) {
      if (selectState.currentOptionFocusValue !== "") {
        setValue(selectState.currentOptionFocusValue);
        if (!enableMultiple) {
          inputRef.current?.focus();
        }
      }
    } else if (keyCode === 27 || keyCode === 9) {
      event.preventDefault();
      handleSelectDropdownVisibility(false);
      inputRef.current?.focus();
    }
  }

  function getFilteredOptions(options: Options[], searchValue: string) {
    return options.filter((option) =>
      option.label.match(searchValue)
    );
  }

  const onDropdownMount = useCallback(() => {
    selectOption(options);
  }, []);

  const isFocused = selectState.isFocused ? "focused" : "";
  const selectedValue = showPlaceholder ? placeholder : valuesWithinOptions.join(",");

  return (
    <div
      ref={selectRef}
      {...remainingSWP}
      className={`select-wrapper ${isChipView ? "selected-chip-view" : ""} ${isFocused} ${sWCN}`.trim()}
      onClick={onClick}
    >
      <label
        className={`select-label ${selectState.value.length > 0 ? "has-value" : ""
          } ${lCN} ${selectState.showDropdown ? "dropdown-open" : ""
          } ${isFocused}`.trim()}
        {...remainingLP}
      >
        {label}
      </label>
      <div
        className={`select-value-wrapper ${isChipView ? "chip-wrapper" : ""}`}
      >
        {isChipView ? (
          <ChipList
            getValue={getValue}
            originalValues={selectState.value}
            controlled={selectState.controlled}
            values={chipValues}
            chipViewEnableRemove={chipViewEnableRemove}
            selectDispatch={selectDispatch}
            focusedChipIndex={selectState.focusedChipIndex}
          />
        ) : (
          <div className="select-value-display">{selectedValue}</div>
        )}
        <input
          ref={inputRef}
          onClick={onInputSelectonClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`select-input ${sCN}`.trim()}
          {...remainingSIP}
        />
      </div>
      {selectState.showDropdown && (
        <div
          className={`option-dropdown ${selectState.dropdownProps.drop}`}
          style={selectState.dropdownProps.style}
          ref={onDropdownMount}
        >
          {enableSearch && (
            <div className="select-search-wrapper">
              <input
                ref={searchInputRef}
                onChange={searchOptions}
                onKeyDown={onSearchInputKeyDown}
                autoFocus
                className={`select-search-input ${sICN}`.trim()}
                {...remaingSearchInputProps}
              />
            </div>
          )}
          <ul
            ref={optionWrapperRef}
            className="select-option-wrapper"
            tabIndex={-1}
          >
            {placeholder && (
              <li tabIndex={-1} className="disabled select-option">
                {placeholder}
              </li>
            )}
            {optionsWithFilter.map((option) => {
              const {
                optionProps = {},
                group = false,
                disabled = false,
              } = option;
              const { className: optCN = "", ...remOP } = optionProps;
              const isSelected = selectState.value.includes(option.value);
              return (
                <li
                  key={option.value}
                  tabIndex={-1}
                  data-value={option.value}
                  onMouseOver={() => {
                    if (!group && !disabled) {
                      selectDispatch({
                        type: SELECT_ACTIONS.SET_OPTION_FOCUS,
                        value: option.value,
                      });
                    }
                  }}
                  className={`select-option ${optCN} ${group ? "option-group" : ""
                    } ${disabled ? "disabled" : ""} ${isSelected ? 'selected' : ''} ${selectState.currentOptionFocusValue === option.value
                      ? "hover"
                      : ""
                    }`.trim()}
                  {...remOP}
                  onClick={(event) => {
                    setValue(option.value, event);
                    if (enableMultiple) {
                      if (enableSearch) {
                        searchInputRef.current?.focus();
                      } else {
                        inputRef.current?.focus();
                      }
                    } else {
                      inputRef.current?.focus();
                    }
                  }}
                >
                  {typeof renderOption === "function" ? (
                    renderOption(option, isSelected)
                  ) : enableMultiple ? (
                    <RenderOptionWithCheckbox
                      label={option.label}
                      showCheckBox={!group}
                      isSelected={isSelected}
                    />
                  ) : (
                    option.label
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <span className="dropdown-icon" />
    </div>
  );
}

export default ReactHookSelect;
