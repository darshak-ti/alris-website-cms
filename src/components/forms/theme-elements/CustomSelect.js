import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const CustomSelect = ({ value, onChange, options, label, size = 'small', fullWidth = false }) => {
  return (
    <FormControl size={size} fullWidth={fullWidth}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={onChange}
        label={label}
        sx={{ minWidth: 120 }}
      >
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  fullWidth: PropTypes.bool,
};

export default CustomSelect; 