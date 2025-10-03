"use client";
import { Dialog } from "@headlessui/react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",  
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* background overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold">Confirm Delete</Dialog.Title>
          <p className="text-sm text-gray-600 mt-2">
            Are you sure you want to delete {itemName}?
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
