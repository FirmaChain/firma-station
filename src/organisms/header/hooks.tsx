import { useState } from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { useAvataURLFromAddress } from "../../apollo/gqls";

export const useAvataURL = () => {
  const { address } = useSelector((state: rootState) => state.wallet);
  const [avatarURL, setAvataURL] = useState("");

  useAvataURLFromAddress({
    onCompleted: async (data) => {
      if (data.validator.length > 0)
        if (
          data.validator[0].validator_descriptions[0].avatar_url !== undefined &&
          data.validator[0].validator_descriptions[0].avatar_url !== null
        )
          setAvataURL(data.validator[0].validator_descriptions[0].avatar_url);
    },
    address,
  });

  return {
    avatarURL,
  };
};
