import React, { useEffect, useState } from 'react';
import { Avatar, FormControlLabel, Checkbox } from "@mui/material";
import Input from "../../../../Components/Input/input";
import { ButtonTypes } from "../../../../Components/Button/ButtonTypes";
import Button from "../../../../Components/Button/Button";
import style from "./ProfileForm.module.css";
import { chekboxStyles } from '../../../../Components/Input/Styles';
import Image from '../../../../Components/uploads/uploadImage';
import AxiosInstance from "../../../../Helpers/Axios";
import { useAuth } from "../../../../Context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useFileUpload, UserProfileData } from '../../../../Hooks/Actions';



const ProfileForm = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const {uploadImage, previewImage} = useFileUpload();

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        setIsLoading(true);
        AxiosInstance.get<UserProfileData>(`/user/${id}`)
            .then(response => {
                setUser(response.data);
                console.log('User fetched:', response.data);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch user data');
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAdmin) return;
        const { name, value } = event.target;
        setUser(prevUser => {
            if (!prevUser) return null;
            if (name === 'email') {
                return {
                    ...prevUser,
                    auth: {
                        ...prevUser.auth,
                        email: value
                    }
                };
            } else {
                return {
                    ...prevUser,
                    [name]: value
                };
            }
        });
    };

  
    const handleUpdate = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!isAdmin || !user) {
            setError('Only admins can update user information');
            return;
        }

        const userToUpdate = {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.auth.email,
            pob: user.pob,
            dob: user.dob,
            gender: user.gender,
        };

        setIsLoading(true);
        try {
            const response = await AxiosInstance.patch(`/user/${id}`, userToUpdate);
            console.log('User updated successfully:', response.data);
            navigate('/home');
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>No user data available</div>;
    }

    return (
        <div className={style.container}>
            <div className={style.title}>Personal Information</div>

            <div className={style.forms}>
                <div className={style.profile}>
                <Avatar 
    src={previewImage || user.imageUrl} 
    style={{ width: "50px", height: "50px" }} 
/>
<Image  onChange={uploadImage}/>
                 
                </div>
                <div className={style.inputWidth}>
                    <Input IsUsername label="firstName" name="firstName" onChange={handleChange} value={user.firstName} />
                </div>
            </div>

            <div className={style.forms}>
                <div className={style.inputWidth}>
                    <Input IsUsername type="email" label="Email" name="email" onChange={handleChange} value={user.auth.email} />
                </div>
                <div className={style.inputWidth}>
                    <Input IsUsername name="lastName" label="lastName" onChange={handleChange} value={user.lastName} />
                </div>
            </div>

            <div className={style.forms}>
                <div className={style.inputWidth}>
                    <Input IsUsername label="BirthDate" name="dob" onChange={handleChange} value={user.dob} />
                </div>
                <div className={style.inputWidth}>
                    <Input IsUsername label="CountryOfBirth" name="pob" onChange={handleChange} value={user.pob} />
                </div>
            </div>

            <div className={style.forms}>
                <div className={style.inputWidth}>
                    <Input IsUsername label="Gender" name="gender" onChange={handleChange} value={user.gender} />
                
                </div>
                <div className={style.inputWidth}>
     
                    <Input IsUsername name="phone" label="PhoneNumber" onChange={handleChange} value={user.phone} />
                </div>
            </div>

            <div className={style.checkboxDiv}>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Public Holidays" sx={{ ...chekboxStyles }}
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label="Remote"
                    sx={{ ...chekboxStyles }}
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label="External"
                    sx={{ ...chekboxStyles }}
                />
            </div>
            <div className={style.border}></div>
            <div className={style.inputWidth}>
                <Button onClick={handleUpdate} type={ButtonTypes.PRIMARY} btnText='Save Changes' />
            </div>
        </div>
    )
}

export default ProfileForm;