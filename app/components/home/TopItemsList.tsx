import { List } from "@mui/material";
import { TopItemAndRank } from "~/models/topItem.server";
import { TopItemsListItem } from "./TopItemsListItem";

interface Props {
  items: TopItemAndRank[];
}

export const TopItemsList = (props: Props) => {
  const { items } = props;
  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
    >
      {items.map((item) => (
        <TopItemsListItem key={item.id} topItem={item} />
      ))}
    </List>
  );
};
