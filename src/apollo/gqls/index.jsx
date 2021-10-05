import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const useBlockDataQuery = ({ onCompleted }) => {
  return useQuery(
    gql`
      query {
        height: block(order_by: { height: desc }, limit: 1) {
          height
        }
        inflation {
          value
        }
        transactions: transaction_aggregate {
          aggregate {
            count
          }
        }
      }
    `,
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};
