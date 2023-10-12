import { Container, ImageList, ImageListItem } from '@mui/material';

import React from 'react';

const ImageListWrapper = ({ itemData, width, height, isProfileImg }) => {
  return (
    <Container>
      <ImageList>
        {itemData.map(item => (
          <ImageListItem
            className={isProfileImg && 'img-wrapper'}
            key={item.img}
            sx={{ width: width, height: height, objectFit: 'contain' }}
          >
            <img
              src={`${item.img}?w=172&h=84&fit=crop&auto=format`}
              srcSet={`${item.img}?w=172&h=844&fit=crop&auto=format&dpr=2`}
              alt={item.title}
              loading='lazy'
              sx={{ width: width, height: height, objectFit: 'contain' }}
            />
            {item.badge && <div className='img-badge'> VIP </div>}
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
};

export default ImageListWrapper;
