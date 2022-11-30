import React, { useState } from "react";
import ReactHookSelect from "../package/react-hook-select/src/ReactHookSelect";
import "../package/react-hook-select/src/styles.scss";

export default {
  title: "Example/Select",
  component: ReactHookSelect,
};

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
  { label: "c label", value: "c" },
  { label: "d label", value: "d" },
];

const Template = (args) => <ReactHookSelect {...args} />;

export const SingleSelection = Template.bind({});

export const SingleSelectionWithSearch = Template.bind({});

export const MultipleSelection = Template.bind({});

export const MultipleSelectionWithSearch = Template.bind({});

export const MultipleSelectionWithChipView = Template.bind({});

export const WithOptGroup = Template.bind({});

export const withClearOption = Template.bind({});

export const ControlledMultipleSelection = () => {
  const [value, setValue] = useState([]);

  return (
    <ReactHookSelect
      {...{
        label: "select",
        placeholder: "choose option",
        value,
        getValue: (value) => setValue(value),
        options,
        enableMultiple: true,
        chipView: false,
      }}
    />
  );
};

function renderChip(props) {
  const { option } = props;
  return (
    <div
      style={{
        padding: "10px 25px",
        marginRight: "8px",
        height: "50px",
        fontSize: "16px",
        borderRadius: "25px",
        backgroundColor: "#f1f1f1",
      }}
    >
      {option.label}
    </div>
  );
}

export const SelectWithCustomChip = () => {
  const [value, setValue] = useState([]);

  return (
    <ReactHookSelect
      {...{
        label: "select",
        placeholder: "choose option",
        value,
        getValue: (value) => setValue(value),
        options,
        enableMultiple: true,
      }}
      renderChip={renderChip}
    />
  );
};

SingleSelection.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options,
};

SingleSelectionWithSearch.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options,
  enableSearch: true,
};

MultipleSelection.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options,
  enableMultiple: true,
  chipView: false,
};

MultipleSelectionWithSearch.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options,
  enableMultiple: true,
  chipView: false,
  enableSearch: true,
};

MultipleSelectionWithChipView.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options,
  enableMultiple: true,
  enableSearch: true,
};

WithOptGroup.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options: [
    { label: "Group A", value: "Group A", group: true },
    { label: "a", value: "a" },
    { label: "Group B", value: "Group B", group: true },
    { label: "b", value: "b" },
  ],
};

withClearOption.args = {
  label: "select",
  placeholder: "choose option",
  defaultValue: [],
  options: [
    { label: "Group A", value: "Group A", group: true },
    { label: "a", value: "a" },
    { label: "Group B", value: "Group B", group: true },
    { label: "b", value: "b" },
  ],
  canClearValue: true,
};
