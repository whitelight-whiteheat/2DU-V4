import { t } from './i18n';

/**
 * Utility functions for improving accessibility
 */

/**
 * Creates an accessible label for an element
 * @param id The ID of the element
 * @param label The label text
 * @returns An object with aria-labelledby and id attributes
 */
export const createAccessibleLabel = (id: string, label: string) => {
  return {
    'aria-labelledby': `${id}-label`,
    id,
    'aria-label': label,
  };
};

/**
 * Creates an accessible description for an element
 * @param id The ID of the element
 * @param description The description text
 * @returns An object with aria-describedby and id attributes
 */
export const createAccessibleDescription = (id: string, description: string) => {
  return {
    'aria-describedby': `${id}-description`,
    id,
  };
};

/**
 * Creates an accessible button with proper ARIA attributes
 * @param id The ID of the button
 * @param label The button label
 * @param onClick The click handler
 * @param disabled Whether the button is disabled
 * @param expanded Whether the button controls an expanded element
 * @param controls The ID of the element controlled by this button
 * @returns An object with button attributes
 */
export const createAccessibleButton = (
  id: string,
  label: string,
  onClick: () => void,
  disabled: boolean = false,
  expanded?: boolean,
  controls?: string
) => {
  const buttonProps: Record<string, any> = {
    id,
    onClick,
    disabled,
    'aria-label': label,
    role: 'button',
    tabIndex: disabled ? -1 : 0,
  };

  if (expanded !== undefined) {
    buttonProps['aria-expanded'] = expanded;
  }

  if (controls) {
    buttonProps['aria-controls'] = controls;
  }

  return buttonProps;
};

/**
 * Creates an accessible input field with proper ARIA attributes
 * @param id The ID of the input
 * @param label The input label
 * @param value The input value
 * @param onChange The change handler
 * @param type The input type
 * @param required Whether the input is required
 * @param placeholder The input placeholder
 * @param error The error message
 * @returns An object with input attributes
 */
export const createAccessibleInput = (
  id: string,
  label: string,
  value: string,
  onChange: (value: string) => void,
  type: string = 'text',
  required: boolean = false,
  placeholder?: string,
  error?: string
) => {
  const inputProps: Record<string, any> = {
    id,
    type,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    'aria-label': label,
    'aria-required': required,
    required,
  };

  if (placeholder) {
    inputProps.placeholder = placeholder;
  }

  if (error) {
    inputProps['aria-invalid'] = true;
    inputProps['aria-errormessage'] = `${id}-error`;
  }

  return inputProps;
};

/**
 * Creates an accessible checkbox with proper ARIA attributes
 * @param id The ID of the checkbox
 * @param label The checkbox label
 * @param checked Whether the checkbox is checked
 * @param onChange The change handler
 * @param disabled Whether the checkbox is disabled
 * @returns An object with checkbox attributes
 */
export const createAccessibleCheckbox = (
  id: string,
  label: string,
  checked: boolean,
  onChange: (checked: boolean) => void,
  disabled: boolean = false
) => {
  return {
    id,
    checked,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
    disabled,
    'aria-label': label,
    role: 'checkbox',
    'aria-checked': checked,
  };
};

/**
 * Creates an accessible select with proper ARIA attributes
 * @param id The ID of the select
 * @param label The select label
 * @param value The selected value
 * @param options The select options
 * @param onChange The change handler
 * @param disabled Whether the select is disabled
 * @returns An object with select attributes
 */
export const createAccessibleSelect = (
  id: string,
  label: string,
  value: string,
  options: { value: string; label: string }[],
  onChange: (value: string) => void,
  disabled: boolean = false
) => {
  return {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
    disabled,
    'aria-label': label,
    role: 'combobox',
    'aria-expanded': false,
    'aria-controls': `${id}-listbox`,
    'aria-haspopup': 'listbox',
  };
};

/**
 * Creates an accessible dialog with proper ARIA attributes
 * @param id The ID of the dialog
 * @param title The dialog title
 * @param open Whether the dialog is open
 * @param onClose The close handler
 * @returns An object with dialog attributes
 */
export const createAccessibleDialog = (
  id: string,
  title: string,
  open: boolean,
  onClose: () => void
) => {
  return {
    id,
    open,
    onClose,
    'aria-labelledby': `${id}-title`,
    'aria-describedby': `${id}-description`,
    role: 'dialog',
    'aria-modal': true,
  };
};

/**
 * Creates an accessible list with proper ARIA attributes
 * @param id The ID of the list
 * @param items The list items
 * @param role The list role
 * @returns An object with list attributes
 */
export const createAccessibleList = (
  id: string,
  items: any[],
  role: 'list' | 'listbox' | 'menu' | 'tablist' = 'list'
) => {
  return {
    id,
    role,
    'aria-label': t(`a11y.${role}`),
  };
};

/**
 * Creates an accessible list item with proper ARIA attributes
 * @param id The ID of the list item
 * @param label The list item label
 * @param role The list item role
 * @param selected Whether the list item is selected
 * @returns An object with list item attributes
 */
export const createAccessibleListItem = (
  id: string,
  label: string,
  role: 'listitem' | 'option' | 'menuitem' | 'tab' = 'listitem',
  selected?: boolean
) => {
  const itemProps: Record<string, any> = {
    id,
    role,
    'aria-label': label,
  };

  if (selected !== undefined) {
    itemProps['aria-selected'] = selected;
  }

  return itemProps;
};

/**
 * Creates an accessible tab panel with proper ARIA attributes
 * @param id The ID of the tab panel
 * @param tabId The ID of the tab that controls this panel
 * @param selected Whether the tab panel is selected
 * @returns An object with tab panel attributes
 */
export const createAccessibleTabPanel = (
  id: string,
  tabId: string,
  selected: boolean
) => {
  return {
    id,
    role: 'tabpanel',
    'aria-labelledby': tabId,
    'aria-hidden': !selected,
    tabIndex: selected ? 0 : -1,
  };
};

/**
 * Creates an accessible tab with proper ARIA attributes
 * @param id The ID of the tab
 * @param label The tab label
 * @param selected Whether the tab is selected
 * @param panelId The ID of the panel controlled by this tab
 * @param onClick The click handler
 * @returns An object with tab attributes
 */
export const createAccessibleTab = (
  id: string,
  label: string,
  selected: boolean,
  panelId: string,
  onClick: () => void
) => {
  return {
    id,
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': panelId,
    'aria-label': label,
    onClick,
    tabIndex: selected ? 0 : -1,
  };
};

/**
 * Creates an accessible tooltip with proper ARIA attributes
 * @param id The ID of the tooltip
 * @param text The tooltip text
 * @returns An object with tooltip attributes
 */
export const createAccessibleTooltip = (id: string, text: string) => {
  return {
    id,
    role: 'tooltip',
    'aria-label': text,
  };
};

/**
 * Creates an accessible alert with proper ARIA attributes
 * @param id The ID of the alert
 * @param text The alert text
 * @param type The alert type
 * @returns An object with alert attributes
 */
export const createAccessibleAlert = (
  id: string,
  text: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  return {
    id,
    role: 'alert',
    'aria-live': type === 'error' ? 'assertive' : 'polite',
    'aria-label': text,
  };
};

/**
 * Creates an accessible progress indicator with proper ARIA attributes
 * @param id The ID of the progress indicator
 * @param value The current value
 * @param max The maximum value
 * @param label The progress label
 * @returns An object with progress attributes
 */
export const createAccessibleProgress = (
  id: string,
  value: number,
  max: number,
  label: string
) => {
  return {
    id,
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-label': label,
    'aria-valuetext': `${value} of ${max}`,
  };
};

/**
 * Creates an accessible image with proper ARIA attributes
 * @param id The ID of the image
 * @param src The image source
 * @param alt The image alt text
 * @returns An object with image attributes
 */
export const createAccessibleImage = (id: string, src: string, alt: string) => {
  return {
    id,
    src,
    alt,
    role: 'img',
  };
};

/**
 * Creates an accessible heading with proper ARIA attributes
 * @param id The ID of the heading
 * @param level The heading level (1-6)
 * @param text The heading text
 * @returns An object with heading attributes
 */
export const createAccessibleHeading = (id: string, level: 1 | 2 | 3 | 4 | 5 | 6, text: string) => {
  return {
    id,
    role: 'heading',
    'aria-level': level,
    'aria-label': text,
  };
};

/**
 * Creates an accessible link with proper ARIA attributes
 * @param id The ID of the link
 * @param href The link URL
 * @param text The link text
 * @param external Whether the link opens in a new tab
 * @returns An object with link attributes
 */
export const createAccessibleLink = (
  id: string,
  href: string,
  text: string,
  external: boolean = false
) => {
  const linkProps: Record<string, any> = {
    id,
    href,
    'aria-label': text,
    role: 'link',
  };

  if (external) {
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
    linkProps['aria-label'] = `${text} (opens in a new tab)`;
  }

  return linkProps;
};

/**
 * Creates an accessible form with proper ARIA attributes
 * @param id The ID of the form
 * @param onSubmit The submit handler
 * @returns An object with form attributes
 */
export const createAccessibleForm = (id: string, onSubmit: (e: React.FormEvent) => void) => {
  return {
    id,
    onSubmit,
    role: 'form',
    'aria-label': t('a11y.form'),
  };
};

/**
 * Creates an accessible fieldset with proper ARIA attributes
 * @param id The ID of the fieldset
 * @param legend The fieldset legend
 * @returns An object with fieldset attributes
 */
export const createAccessibleFieldset = (id: string, legend: string) => {
  return {
    id,
    role: 'group',
    'aria-labelledby': `${id}-legend`,
    'aria-label': legend,
  };
};

/**
 * Creates an accessible legend with proper ARIA attributes
 * @param id The ID of the legend
 * @param text The legend text
 * @returns An object with legend attributes
 */
export const createAccessibleLegend = (id: string, text: string) => {
  return {
    id,
    role: 'legend',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table with proper ARIA attributes
 * @param id The ID of the table
 * @param caption The table caption
 * @returns An object with table attributes
 */
export const createAccessibleTable = (id: string, caption: string) => {
  return {
    id,
    role: 'table',
    'aria-label': caption,
  };
};

/**
 * Creates an accessible table row with proper ARIA attributes
 * @param id The ID of the table row
 * @returns An object with table row attributes
 */
export const createAccessibleTableRow = (id: string) => {
  return {
    id,
    role: 'row',
  };
};

/**
 * Creates an accessible table cell with proper ARIA attributes
 * @param id The ID of the table cell
 * @param header Whether the cell is a header
 * @returns An object with table cell attributes
 */
export const createAccessibleTableCell = (id: string, header: boolean = false) => {
  return {
    id,
    role: header ? 'columnheader' : 'cell',
  };
};

/**
 * Creates an accessible table caption with proper ARIA attributes
 * @param id The ID of the table caption
 * @param text The caption text
 * @returns An object with table caption attributes
 */
export const createAccessibleTableCaption = (id: string, text: string) => {
  return {
    id,
    role: 'caption',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table header with proper ARIA attributes
 * @param id The ID of the table header
 * @param text The header text
 * @returns An object with table header attributes
 */
export const createAccessibleTableHeader = (id: string, text: string) => {
  return {
    id,
    role: 'columnheader',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table body with proper ARIA attributes
 * @param id The ID of the table body
 * @returns An object with table body attributes
 */
export const createAccessibleTableBody = (id: string) => {
  return {
    id,
    role: 'rowgroup',
  };
};

/**
 * Creates an accessible table footer with proper ARIA attributes
 * @param id The ID of the table footer
 * @returns An object with table footer attributes
 */
export const createAccessibleTableFooter = (id: string) => {
  return {
    id,
    role: 'rowgroup',
  };
};

/**
 * Creates an accessible table header row with proper ARIA attributes
 * @param id The ID of the table header row
 * @returns An object with table header row attributes
 */
export const createAccessibleTableHeaderRow = (id: string) => {
  return {
    id,
    role: 'row',
  };
};

/**
 * Creates an accessible table footer row with proper ARIA attributes
 * @param id The ID of the table footer row
 * @returns An object with table footer row attributes
 */
export const createAccessibleTableFooterRow = (id: string) => {
  return {
    id,
    role: 'row',
  };
};

/**
 * Creates an accessible table data cell with proper ARIA attributes
 * @param id The ID of the table data cell
 * @param text The cell text
 * @returns An object with table data cell attributes
 */
export const createAccessibleTableDataCell = (id: string, text: string) => {
  return {
    id,
    role: 'cell',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table header cell with proper ARIA attributes
 * @param id The ID of the table header cell
 * @param text The cell text
 * @returns An object with table header cell attributes
 */
export const createAccessibleTableHeaderCell = (id: string, text: string) => {
  return {
    id,
    role: 'columnheader',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table footer cell with proper ARIA attributes
 * @param id The ID of the table footer cell
 * @param text The cell text
 * @returns An object with table footer cell attributes
 */
export const createAccessibleTableFooterCell = (id: string, text: string) => {
  return {
    id,
    role: 'cell',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table row header with proper ARIA attributes
 * @param id The ID of the table row header
 * @param text The header text
 * @returns An object with table row header attributes
 */
export const createAccessibleTableRowHeader = (id: string, text: string) => {
  return {
    id,
    role: 'rowheader',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table row footer with proper ARIA attributes
 * @param id The ID of the table row footer
 * @param text The footer text
 * @returns An object with table row footer attributes
 */
export const createAccessibleTableRowFooter = (id: string, text: string) => {
  return {
    id,
    role: 'cell',
    'aria-label': text,
  };
};

/**
 * Creates an accessible table row group with proper ARIA attributes
 * @param id The ID of the table row group
 * @returns An object with table row group attributes
 */
export const createAccessibleTableRowGroup = (id: string) => {
  return {
    id,
    role: 'rowgroup',
  };
};

/**
 * Creates an accessible table column group with proper ARIA attributes
 * @param id The ID of the table column group
 * @returns An object with table column group attributes
 */
export const createAccessibleTableColumnGroup = (id: string) => {
  return {
    id,
    role: 'colgroup',
  };
};

/**
 * Creates an accessible table column with proper ARIA attributes
 * @param id The ID of the table column
 * @returns An object with table column attributes
 */
export const createAccessibleTableColumn = (id: string) => {
  return {
    id,
    role: 'column',
  };
};

/**
 * Creates an accessible table row with proper ARIA attributes
 * @param id The ID of the table row
 * @returns An object with table row attributes
 */
export const createAccessibleTableRowWithRole = (id: string) => {
  return {
    id,
    role: 'row',
  };
};

/**
 * Creates an accessible table cell with proper ARIA attributes
 * @param id The ID of the table cell
 * @returns An object with table cell attributes
 */
export const createAccessibleTableCellWithRole = (id: string) => {
  return {
    id,
    role: 'cell',
  };
};

/**
 * Creates an accessible table header with proper ARIA attributes
 * @param id The ID of the table header
 * @returns An object with table header attributes
 */
export const createAccessibleTableHeaderWithRole = (id: string) => {
  return {
    id,
    role: 'columnheader',
  };
};

/**
 * Creates an accessible table row header with proper ARIA attributes
 * @param id The ID of the table row header
 * @returns An object with table row header attributes
 */
export const createAccessibleTableRowHeaderWithRole = (id: string) => {
  return {
    id,
    role: 'rowheader',
  };
};

/**
 * Creates an accessible table caption with proper ARIA attributes
 * @param id The ID of the table caption
 * @returns An object with table caption attributes
 */
export const createAccessibleTableCaptionWithRole = (id: string) => {
  return {
    id,
    role: 'caption',
  };
};

/**
 * Creates an accessible table body with proper ARIA attributes
 * @param id The ID of the table body
 * @returns An object with table body attributes
 */
export const createAccessibleTableBodyWithRole = (id: string) => {
  return {
    id,
    role: 'rowgroup',
  };
};

/**
 * Creates an accessible table footer with proper ARIA attributes
 * @param id The ID of the table footer
 * @returns An object with table footer attributes
 */
export const createAccessibleTableFooterWithRole = (id: string) => {
  return {
    id,
    role: 'rowgroup',
  };
};

/**
 * Creates an accessible table header row with proper ARIA attributes
 * @param id The ID of the table header row
 * @returns An object with table header row attributes
 */
export const createAccessibleTableHeaderRowWithRole = (id: string) => {
  return {
    id,
    role: 'row',
  };
};

/**
 * Creates an accessible table footer row with proper ARIA attributes
 * @param id The ID of the table footer row
 * @returns An object with table footer row attributes
 */
export const createAccessibleTableFooterRowWithRole = (id: string) => {
  return {
    id,
    role: 'row',
  };
};

/**
 * Creates an accessible table row group with proper ARIA attributes
 * @param id The ID of the table row group
 * @returns An object with table row group attributes
 */
export const createAccessibleTableRowGroupWithRole = (id: string) => {
  return {
    id,
    role: 'rowgroup',
  };
};

/**
 * Creates an accessible table column group with proper ARIA attributes
 * @param id The ID of the table column group
 * @returns An object with table column group attributes
 */
export const createAccessibleTableColumnGroupWithRole = (id: string) => {
  return {
    id,
    role: 'colgroup',
  };
};

/**
 * Creates an accessible table column with proper ARIA attributes
 * @param id The ID of the table column
 * @returns An object with table column attributes
 */
export const createAccessibleTableColumnWithRole = (id: string) => {
  return {
    id,
    role: 'column',
  };
}; 