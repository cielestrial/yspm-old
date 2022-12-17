import { Button } from "@mantine/core";
import { useContext } from "react";
import { StateContext } from "../api/ContextProvider";
import { generatePlaylistKey } from "../api/misc/HelperFunctions";
import { useSpotifyQuery } from "../api/QueryApi";
import {
  addGenreSubscriptions,
  addPlaylistSubscriptions,
} from "../api/SpotifyApiClientSide";
import { playlistType } from "../api/SpotifyApiClientTypes";

type proptype = {
  setSelected: (selected: playlistType | undefined) => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<number>>;
};

const UpdateAllButton = (props: proptype) => {
  const context = useContext(StateContext);
  const addSubscriptions = async () => {
    props.setLoading((prev) => prev + 1);

    const resAll = await Promise.allSettled([
      useSpotifyQuery(addPlaylistSubscriptions, 0),
      useSpotifyQuery(addGenreSubscriptions, 0),
    ]);
    props.setSelected(undefined);

    props.setLoading((prev) => prev - 1);
    return resAll;
  };

  const updateHandler = async () => {
    if (
      context.playlistsQ.current === undefined ||
      context.selectedPlaylist.current === undefined
    )
      return;
    console.log(generatePlaylistKey(context.selectedPlaylist.current));
    await addSubscriptions();
  };

  return (
    <Button
      w="35%"
      miw="min-content"
      compact
      variant="outline"
      disabled={context.playlistsQ.current === undefined}
      color="green"
      radius="xl"
      size="md"
      onClick={updateHandler}
    >
      {"Update All"}
    </Button>
  );
};

export default UpdateAllButton;