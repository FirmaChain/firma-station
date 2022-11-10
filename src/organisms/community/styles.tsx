import styled from 'styled-components';

export const TopCardWrapper = styled.div`
  width: 100%;
  margin: 80px 0 70px 0;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 900px) {
    margin: 50px 0 50px 0;
  }
`;

export const TitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 50px;
  font-size: ${({ theme }) => theme.sizes.communityTitle};
  color: #eee;
  margin-bottom: 1.6rem;
`;

export const SubTitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 25px;
  color: #a1a1ac;
  font-size: ${({ theme }) => theme.sizes.communitySubTitle};
`;

export const CommunityWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

export const CommunityItem = styled.div`
  cursor: pointer;
  text-align: center;
  opacity: 0.8;

  &:hover {
    font-weight: 600;
    opacity: 1;
  }

  @media only screen and (max-width: 900px) {
    width: 30%;
  }
`;

export const CommunityItemIcon = styled.div<{ icon: string }>`
  width: 80px;
  height: 80px;
  background-image: url('${(props) => props.icon}');
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
