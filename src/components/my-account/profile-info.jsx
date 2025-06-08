import React, { useState, useEffect } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import AuthUser from '@/auth/authuser';
// internal
import ErrorMsg from '../common/error-msg';
import { EmailTwo, LocationTwo, PhoneThree, UserThree } from '@/svg';
import { notifyError, notifySuccess } from '@/utils/toast';

// yup schema
const schema = Yup.object().shape({
});

const ProfileInfo = () => {
  const { user, http } = AuthUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await http.get(`/user/profile/${user?.user_id}`);
      setProfileData(response.data);
      console.log(response.data);
      
      // Set form values
      if (response.data) {
        setValue('name', response.data.user_name || user?.user_name || '');
        setValue('email', response.data.user_email || user?.user_email || '');
        setValue('phone', response.data.user_mobile || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      notifyError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchProfile();
    }
  }, [user]);

  // on submit
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      const response = await http.put(`/user/profile`, {
        name: data.name,
        email: data.email,
        user_id:user?.user_id,
        phone: data.phone,
      });

      notifySuccess(response.data.message || 'Profile updated successfully');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      notifyError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile__info">
        <h3 className="profile__info-title">Personal Details</h3>
        <div className="profile__info-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>
      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input 
                    {...register("name")} 
                    name='name' 
                    type="text" 
                    placeholder="Enter your username" 
                    disabled={isUpdating}
                  />
                  <span>
                    <UserThree/>
                  </span>
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input 
                    {...register("email")} 
                    name='email' 
                    type="email" 
                    placeholder="Enter your email" 
                    disabled={isUpdating}
                  />
                  <span>
                    <EmailTwo/>
                  </span>
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input 
                    {...register("phone")} 
                    name='phone' 
                    type="text" 
                    placeholder="Enter your number" 
                    disabled={isUpdating}
                  />
                  <span>
                    <PhoneThree/>
                  </span>
                  <ErrorMsg msg={errors.phone?.message} />
                </div>
              </div>
            </div>

    


            <div className="col-xxl-12">
              <div className="profile__btn">
                <button 
                  type="submit" 
                  className="tp-btn" 
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .loading-spinner .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #4299e1;
          animation: spin 1s ease-in-out infinite;
        }
        
        .loading-spinner p {
          margin-top: 1rem;
          color: #4a5568;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .profile__input input:disabled,
        .profile__input textarea:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }
        
        .tp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ProfileInfo;