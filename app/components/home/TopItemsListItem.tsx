import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { TopItemAndRank } from "~/models/topItem.server";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Props {
  topItem: TopItemAndRank;
}

export const TopItemsListItem = (props: Props) => {
  const { topItem } = props;
  const labelId = `list-item-label-${topItem.id}`;
  const rankChange = !!topItem.previousRank
    ? topItem.rank - topItem.previousRank
    : null;

  const listItemContent = (
    <div>
      <span className="mx-2.5 text-xl font-bold">{topItem.rank + 1}</span>
      <span className="min-w-80 mx-2.5 w-80">
        {rankChange !== null && rankChange !== 0 && (
          <span>
            {rankChange! > 0 ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}{" "}
            {Math.abs(rankChange!)}
          </span>
        )}
      </span>

      <span className="text-base">{topItem.name}</span>
    </div>
  );

  return (
    <ListItem key={topItem.id} disablePadding>
      <ListItemButton>
        <ListItemText id={labelId} primary={listItemContent} />
      </ListItemButton>
    </ListItem>
  );
};
