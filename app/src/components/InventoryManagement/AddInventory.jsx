import React, {useState,useEffect,useRef} from 'react'
import { useForm, Controller } from "react-hook-form";
import { useLocation, useHistory } from 'react-router-dom';
import { FormLabel, TextField, Paper, Button, Grid, Typography } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

import DateRangeIcon from '@material-ui/icons/DateRange';

import useStyles from './styles';

const schema = yup.object().shape({
    productType: yup.string().required("Select Product Type"),
    productName: yup.string().required("Enter the Product Name"),
    quantity: yup.string().required("Enter the Quantity"),
    pricePeritem: yup.string().required("Enter the Price"),
    manfDate: yup.string().required("Manufacture Date is required."),
    expDate: yup.string().required("Expire Date is required."),
    brand: yup.string().required("You must enter the Products brand"),
    description: yup.string().required('You must enter a Description'),
});

const productTypes = [
    {
      value: 'default',
      label: 'Select Product Type',
    },
    {
      value: 'Drug',
      label: 'Drug',
    },
    {
      value: 'Equipment',
      label: 'Equipment',
    },
];

const AddInventory = () => {
    const classes = useStyles();
    const { control, handleSubmit, reset, formState: { errors }  } = useForm(
        {
            resolver: yupResolver(schema),
            reValidateMode: 'onSubmit',
        }
    );
    const [productType, setProductType] = React.useState('default');
    const [position, setPosition] = React.useState('default');
    const [formData, setFormData] = useState([]);
    const isFirstRender = useRef(true);
    const [nextId, setNextId] = useState("");

    const [gender, setGender] = useState("");
    const history = useHistory();

    const CssTextField = withStyles({
        root: {
          '& .MuiInputLabel-root': {
            color: '#6e6e6e',
          },
          '& .MuiTextField-root': {
            color: '#6e6e6e',
          },
          '& .MuiFormHelperText-root': {
            color: '#6e6e6e',
          },
          '& label.Mui-focused': {
            color: '#6e6e6e',
          },
          '& .MuiInputBase-input':{
            color: '#1a1a1a',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#6e6e6e',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#6e6e6e',
            },
            '&:hover fieldset': {
              borderColor: '#0077B6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0077B6',
            },
          },
        },
        input: {
          color: "#1a1a1a"
        }
    })(TextField);

    useEffect(() => {
        getMaxId();

        if (isFirstRender.current) {
            isFirstRender.current = false 
            return;
        }
       
        submitForm(formData);
    }, [formData])

    const getMaxId = () => {
        axios
        .get("http://localhost:5000/api/invMngmnt/getMaxId")
        .then((response) => {
            console.log(response.data.productId);
          if(response.data.productId == null)
          {
            setNextId(1);
          }else{
            setNextId(response.data.productId + 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }


    const onSubmit = (data) => {

        var codeId = document.getElementById("productId").value

        setFormData({
            productId: nextId,
            productType: data.productType,
            productName: data.productName,
            quantity: data.quantity,
            pricePerItem: data.pricePeritem,
            manufactureDate: data.manfDate,
            expiredDate: data.expDate,
            description: data.description,
            brand: data.brand,
        })
    }

    const submitForm = (data) => {
        axios.post('http://localhost:5000/api/invMngmnt/AddInvMngmnt', data)
        .then((response) => {
          console.log(response);
          history.push('/all-inventory');
          reset({
            keepErrors: true,
          });
        }).catch((err) => {
          console.log(err);
        })
    }

    const handleProductType = (event) => {
        setProductType(event.target.value, console.log(productType));
    };

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paperTitle}>
                        <Typography variant="h4" className={classes.pageTitle}>Add New Item</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                        <Paper className={classes.paper}>   
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <Controller
                                            name="productType"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                            <CssTextField
                                                fullWidth
                                                select
                                                label="Product Type"
                                                value={productType}
                                                onChange={handleProductType}
                                                variant="outlined"
                                                error={!!errors?.productType}
                                                helperText={errors?.productType?.message}
                                                {...field}
                                                >
                                                {productTypes.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </CssTextField>}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="productName"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                            <CssTextField 
                                            fullWidth 
                                            label="Product Name" 
                                            variant="outlined" 
                                            color="primary" 
                                            error={!!errors?.productName}
                                            helperText={errors?.productName?.message} 
                                            {...field} />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="quantity"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                            <CssTextField 
                                            fullWidth label="Quantity" 
                                            variant="outlined" 
                                            color="primary"
                                            error={!!errors?.quantity}
                                            helperText={errors?.quantity?.message} 
                                            {...field} />}
                                        />
                                    </Grid> 

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="pricePeritem"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                            <CssTextField 
                                            fullWidth label="Price Per Item" 
                                            variant="outlined" 
                                            color="primary"
                                            error={!!errors?.pricePeritem}
                                            helperText={errors?.pricePeritem?.message} 
                                            {...field} />}
                                        />
                                    </Grid> 

                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="description"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Description"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                defaultValue=""
                                                color="primary"
                                                variant="outlined"
                                                error={!!errors?.description}
                                                helperText={errors?.description?.message} 
                                                {...field}
                                            />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="manfDate"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                                <CssTextField
                                                    fullWidth
                                                    label="Manufacture Date"
                                                    type="date"
                                                    variant="outlined"
                                                    color="primary"
                                                    error={!!errors?.manfDate}
                                                    helperText={errors?.manfDate?.message} 
                                                    {...field}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <DateRangeIcon />
                                                          </InputAdornment>
                                                        ),
                                                    }}
                                            />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="expDate"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                                <CssTextField
                                                    fullWidth
                                                    label="Expiration Date"
                                                    type="date"
                                                    variant="outlined"
                                                    color="primary"
                                                    error={!!errors?.expDate}
                                                    helperText={errors?.expDate?.message} 
                                                    {...field}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <DateRangeIcon />
                                                          </InputAdornment>
                                                        ),
                                                    }}
                                            />}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="brand"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => 
                                            <CssTextField  
                                            fullWidth 
                                            label=" Brand " 
                                            variant="outlined" 
                                            color="primary" 
                                            error={!!errors?.brand}
                                            helperText={errors?.brand?.message}
                                            {...field} />}
                                        />
                                    </Grid>        
                                </Grid>
                        </Paper>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <Button type="reset" fullWidth variant="contained" 
                                className={classes.resetbtn}
                                onClick={() => {
                                  reset({
                                    keepErrors: true,
                                  });
                                }}>
                                    Reset
                                </Button>
                            </Grid>    
                            <Grid item xs={12} sm={9}>
                                <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submitbtn}>
                                    Submit
                                </Button>
                            </Grid>
                            <Grid hidden='ture' item xs={12}>
                                <h1 id="productId" name="productId">{nextId}</h1>
                            </Grid>
                        </Grid> 
                    </form>
                </Grid>
            </Grid>    
        </div>
    )
}

export default AddInventory 
