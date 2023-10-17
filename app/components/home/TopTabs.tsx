import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TopTrack, TopArtist } from "@prisma/client";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Props {
  topTracks: TopTrack[];
  topArtists: TopArtist[];
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TopTabs(props: Props) {
  const { topTracks, topArtists } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Billboard charts tabs"
        >
          <Tab label="Tracks" {...a11yProps(0)} />
          <Tab label="Artists" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {topTracks.map((t) => (
          <div key={t.id}>{t.name}</div>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {topArtists.map((t) => (
          <div key={t.id}>{t.name}</div>
        ))}
      </CustomTabPanel>
    </Box>
  );
}
