import { Button } from '@mui/material';
import React from 'react';

export const CustomButton = ({
  label,
  color,
  endIcon,
  variant,
  startIcon,
  isDisabled,
  handleClick,
  style
}) => {
  return (
    <Button
      color={color}
      onClick={handleClick}
      variant={variant}
      endIcon={endIcon}
      startIcon={startIcon}
      disabled={isDisabled}
      sx={{
        color: style?.color,
        border: style?.border,
        background: style?.background,
        backgroundColor: style?.bgColor,
        justifyContent: style?.justifyContent,
        alignItems: style?.justifyContent,
        textUnderlineOffset: style?.textUnderlineOffset,
        textDecoration: style?.textDecoration ? style.textDecoration : 'none',
        textTransform: style?.textTransformation ? style.textTransformation : 'none',
        ['& .MuiButton-root']: {
          borderRadius: 0,
          textDecoration: 'none',
          textTransform: 'none'
        }
      }}
    >
      {label}
    </Button>
  );
};
