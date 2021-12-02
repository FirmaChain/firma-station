import { useState } from "react";
import { useAvataURLFromAddress } from "../../apollo/gqls";

export const useAvataURL = (address: string) => {
  const [avatarURL, setAvataURL] = useState("");
  const [moniker, setMoniker] = useState(address);

  useAvataURLFromAddress({
    onCompleted: async (data) => {
      if (data.validator.length > 0) {
        if (
          data.validator[0].validator_descriptions[0].avatar_url !== undefined &&
          data.validator[0].validator_descriptions[0].avatar_url !== null
        )
          setAvataURL(data.validator[0].validator_descriptions[0].avatar_url);

        if (
          data.validator[0].validator_descriptions[0].moniker !== undefined &&
          data.validator[0].validator_descriptions[0].moniker !== ""
        )
          setMoniker(data.validator[0].validator_descriptions[0].moniker);
      }
    },
    address,
  });

  return {
    avatarURL,
    moniker,
  };
};
