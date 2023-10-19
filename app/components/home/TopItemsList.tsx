import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { TopItemAndRank } from "~/models/topItem.server";

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
      {items.map((item, i) => {
        const labelId = `list-item-label-${item.id}`;
        return (
          <ListItem key={item.id} disablePadding>
            <ListItemButton>
              {/* <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar> */}

              <ListItemText
                id={labelId}
                primary={`${item.topItemRanks[0]?.rank}: ${item.name}`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
