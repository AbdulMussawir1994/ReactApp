import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/Global.css';

const AddRole = () => {
  const [formData, setFormData] = useState({ email: '', roleName: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles input changes and updates state
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Handles form submission and API call
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.post('UserRoles/AddUserToRole', formData);
      
      if (data.status?.isSuccess) {
        await Swal.fire({
          icon: 'success',
          title: 'Role Assigned',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/dashboard');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: data.status?.statusMessage || 'Could not assign role.',
        });
      }

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: err?.message || 'Unexpected error occurred.',
      });
    }

    setLoading(false);
  };

  return (
    <Box className="form-container">
      <Paper elevation={4} className="form-card" style={{marginTop: '-4rem'}}>
        <Typography variant="h5" gutterBottom>
          Add User to Role
        </Typography>

        <form onSubmit={handleSubmit} className="form-fields">
          <TextField
            label="User Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Role Name"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Assign Role'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddRole;
