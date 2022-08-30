import styled from 'styled-components';

export const ContentContainer = styled.div`
  flex: 1;
  z-index: 2;
  width: calc(100% - 80px);
  height: 100%;
  padding: 0 40px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
  display: flex;
  gap: 20px;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 0 10px;
  }
`;

export const RestakeContainer = styled.div`
  width: calc(100%);
  min-height: 100%;
  font-size: 1.6rem;
  color: white;
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: stretch;
  align-content: stretch;
  @media only screen and (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

export const RestakeLeft = styled.div`
  display: flex;
  width: 33%;
  @media only screen and (max-width: 900px) {
    width: 100%;
    flex-grow: 1;
  }
`;

export const RestakeRight = styled.div`
  display: flex;
  width: 67%;
  @media only screen and (max-width: 900px) {
    width: 100%;
    flex-grow: 1;
  }
`;
export const LabelWrapper = styled.div`
  display: inline-block;
  width: 100%;
`;

export const Label = styled.div`
  display: inline-block;
  font-size: 2.2rem;
  color: #bbb;
  margin-top: 10px;
`;

export const MoreView = styled.div`
  float: right;
  display: flex;
  width: 100px;
  font-size: 16px;
  line-height: 22px;
  margin-top: 7px;
  color: #ccc;
  cursor: pointer;
`;

export const OpenIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('${(props) => props.theme.urls.openArrow}');
`;
