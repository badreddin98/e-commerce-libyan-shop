import React from 'react';
import { Box, Container, Typography, styled } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

const BannerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFF7E6',
  padding: theme.spacing(1, 0),
  borderBottom: '1px solid #EAEAEA',
}));

const BannerItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2),
  '& svg': {
    fontSize: '1.2rem',
    color: theme.palette.secondary.main,
  },
  '& .MuiTypography-root': {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}));

const BannerContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const TopBanner = () => {
  return (
    <BannerContainer>
      <Container maxWidth="lg">
        <BannerContent>
          <BannerItem>
            <LocalShippingIcon />
            <Typography>
              FREE STANDARD SHIPPING ON ORDERS OF $29+
            </Typography>
          </BannerItem>
          <BannerItem>
            <AssignmentReturnIcon />
            <Typography>
              FREE RETURNS *CONDITIONS APPLY
            </Typography>
          </BannerItem>
          <BannerItem>
            <PriceCheckIcon />
            <Typography>
              PRICE ADJUSTMENT WITHIN 30 DAYS
            </Typography>
          </BannerItem>
        </BannerContent>
      </Container>
    </BannerContainer>
  );
};

export default TopBanner;
