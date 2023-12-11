import { Checkbox, Table } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { TProjectItem } from "../../../../../types/TProjectItem";
import TableItemRow from "./TableItemRow/tableItemRow";
import { TCredentials } from "../../../../../types/TCredentials";

interface Props {
  items: TProjectItem[];
  credentials:TCredentials[]
  selectedItems:TProjectItem[]
  setSelectedItems:(items:TProjectItem[])=>void
  isGroupUpload:boolean
  currUploadItem:TProjectItem|undefined
}

const ItemsTable: React.FC<Props> = ({ items, credentials, selectedItems, setSelectedItems, isGroupUpload, currUploadItem }) => {

  const [check, setCheck] = useState<boolean | 'indeterminate'>(false)

  useEffect(() => {
    if (selectedItems.length===items.length){
      setCheck(true)
    } else {
      setCheck(false)
    }
  }, [selectedItems, items]);
  const handleSelectAllItems = (checked:boolean | 'indeterminate'):void=>{
    if (checked){
      setSelectedItems(items)
      return
    } else {
      setSelectedItems([])
      return
    }
  }

  return (
    <>
      {items.length >= 1 &&
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell justify='center'>
                <Checkbox checked={check} onCheckedChange={checked => handleSelectAllItems(checked)} />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Таблица</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Лист</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Автозагрузка</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Предочистка</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Последнее обновление</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Статус</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'>Действия</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify='center'></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items.map(item => {
              return (
                <TableItemRow
                  currUploadItem={currUploadItem}
                  isGroupUpload={isGroupUpload}
                  key={Number(item.id)}
                  item={item}
                  credentials={credentials}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}/>
              );
            })}
          </Table.Body>
        </Table.Root>
      }
    </>
  );
};

export default ItemsTable;
