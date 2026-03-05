import { PROPOSAL_MESSAGE_TYPE } from '../constants/governance';

export const getProposalTypeLabels = (proposalTypeSummary: string[]): string[] => {
  if (Array.isArray(proposalTypeSummary) === false || proposalTypeSummary.length === 0) return ['UNKNOWN'];
  return proposalTypeSummary.map((typeRaw) => PROPOSAL_MESSAGE_TYPE[typeRaw] || typeRaw);
};

