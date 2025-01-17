import { useState } from 'react';
import { Button, Confirm } from 'semantic-ui-react';

/**
 * ConfirmButton component renders a button that, when clicked, shows a confirmation dialog.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.confirmText='Are you sure?'] - The text to display in the confirmation dialog.
 * @param {string} [props.buttonName='Delete'] - The text to display on the button.
 * @param {Function} props.onClick - The function to call when the confirmation is accepted.
 *
 * @returns {JSX.Element} The rendered ConfirmButton component.
 */
export default function ConfirmButton({ confirmText = 'Are you sure about that.', buttonName = 'Delete', onClick }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonName}</Button>
      <Confirm
        confirmButton={'Yes'}
        header={confirmText}
        open={open}
        onConfirm={() => {
          onClick();
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
}
