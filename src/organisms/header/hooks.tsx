import { useState, useEffect, useRef } from "react";

import useFirma from "../../utils/wallet";
import { useAvataURLFromAddress } from "../../apollo/gqls";

export const useAvataURL = (address: string) => {
  const [avatarURL, setAvataURL] = useState("");
  const [moniker, setMoniker] = useState(address);

  const { setUserData } = useFirma();

  useInterval(() => {
    setUserData()
      .then(() => {})
      .catch(() => {});
  }, 2000);

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

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      tick();
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
