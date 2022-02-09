import styled from "styled-components";

export const TopCardWrapper = styled.div`
  width: 100%;
  margin: 80px 0;
  display: flex;
  flex-direction: column;
`;
export const TitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 50px;
  font-size: ${({ theme }) => theme.sizes.communityTitle};
  color: #eee;
`;
export const SubTitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.communitySubTitle};
`;

export const CommunityWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

export const CommunityItem = styled.div`
  width: 150px;
  cursor: pointer;
  text-align: center;
  opacity: 0.8;

  &:hover {
    font-weight: 600;
    opacity: 1;
  }
`;

export const CommunityItemIcon = styled.div<{ icon: string }>`
  width: 100px;
  height: 100px;
  background-image: url("${(props) => props.icon}");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin: auto;
`;

export const CommunityItemTypo = styled.div`
  width: 100%;
  margin-top: 20px;
  color: #eee;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;
