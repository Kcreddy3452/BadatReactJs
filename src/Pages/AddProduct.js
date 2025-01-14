import React,{useEffect, useState, useRef} from 'react'
//import LoadingOverlay from "react-loading-overlay";
import { getSubCategory, getVerticalCategory, getCategory, addProduct } from "../AppApi";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Alert from '@material-ui/lab/Alert';
import { checkLogin } from "../Util";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: 100,
    height: 100,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    padding: "18.5px 14px",
    font: "inherit",
    width: "100%",
    border: 0,
    height: "1.1876em",
    margin: 0,
    minWidth: 0,
    background: "none",
    boxSizing: "content-box"
  },
  filebtn:{
    display: "flex",
    alignItems: "center"
  },
  backdrop: {
    zIndex: 1,
    color: '#fff',
  },  
}));




const AddProductForm = () => {
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [moq, setMoq] = useState();  
  const [description, setDiscription] = useState();
  const [categoryId, setCategoryId] = useState(0);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const [verticalId, setVerticalId] = useState(0);
  const [imgLoad, setImgLoad] = useState(false)
  const [fileError, setFileError] = useState(false)
  const [images, setImages] = useState([]);
  const [backdrop, setBackdrop] = useState(false)


  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [verticalData, setVerticalData] = useState([]);

  const isFirstRun = useRef(true);

  const classes = useStyles();


  useEffect(() => {
      async function fetchData() {  
        const login = await checkLogin()
        if (!login) {
          window.location.href="/login"
        }
        const cat1 = await getCategory();
        setCategoryData(cat1.data.data);
      }
      fetchData();
   }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

      async function fetchData() {  
        const cat2 = await getSubCategory(categoryId);
        setSubCategoryData(cat2.data.data);
      }
      fetchData();
   }, [categoryId]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

      async function fetchData() {  
        const cat3 = await getVerticalCategory(subCategoryId);
          setVerticalData(cat3.data.data)
      }
      fetchData();
   }, [subCategoryId]);



  const handleChange = (event) => {
    //console.log(event.target.value)
  };

  const onFileChange = event => {
    setImages(event.target.files);
    setImgLoad(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  /*if (images.length>0) {
      setBackdrop(true)
      var dataset = {
        "name" : name,
        "desc" : description,
        "moq" : moq,
        "price" : price,
        "categoryId" : categoryId,
        "subCategoryId" : subCategoryId,
        "verticalId" : verticalId
      }
      addProduct(dataset,images);    
    }else{
      setFileError(true)
    }*/
    setBackdrop(true)
      var dataset = {
        "name" : name,
        "desc" : description,
        "moq" : moq,
        "price" : price,
        "categoryId" : categoryId,
        "subCategoryId" : subCategoryId,
        "verticalId" : verticalId
      }
      addProduct(dataset,images); 
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
        <Backdrop className={classes.backdrop} open={backdrop}>
          <CircularProgress />
        </Backdrop>        
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add Product
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                variant="outlined"
                required
                fullWidth
                onChange={(e) => {
                  setName(e.target.value);
                }}
                id="name"
                label="Produt Title Name"
              />
            </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
              id="description"
              required
              fullWidth
              multiline
              rows={3}
              label="Product Details"
              onChange={(e) => {
                setDiscription(e.target.value)
              }}
              variant="outlined"
          />
          </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="number"
                id="moq"
                onChange={(e) => {
                  setMoq(e.target.value);
                }}                
                label="Minimum Order Quantity"
                name="moq"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="price"  
                label="Price per Quantity"      
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}    
                name="price"
              />
            </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="categoryId"
              select          
              required    
              fullWidth
              label="Category"
              onChange={(e) => {setCategoryId(e.target.value)}}
              variant="outlined"
          >
            { categoryData.length > 0 ?
              categoryData.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.name}
                </MenuItem>
              )) : <MenuItem key="error" value={0}>
                      Error loading categories!
                    </MenuItem>
            }
          </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="subCategoryId"
              select              
              fullWidth              
              label="Subcategory"
              onChange={(e) => { setSubCategoryId(e.target.value)}}
              variant="outlined"
          >
            { subCategoryData.length > 0 ?
              subCategoryData.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.name}
                </MenuItem>
              )) :  <MenuItem key="error" value={0}>
                        None
                    </MenuItem>
            }
          </TextField>
          </Grid>
                    <Grid item xs={12} sm={6}>
            <TextField
              id="verticalId"
              select              
              fullWidth
              label="Section"
              onChange={(e) => {setVerticalId(e.target.value)}}
              variant="outlined"
          >
            { verticalData.length > 0 ?
              verticalData.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.name}
                </MenuItem>
              )) : 
                    <MenuItem key="error" value={0}>
                      None
                    </MenuItem>
            }
          </TextField>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.filebtn}>     
          <Button
            variant="contained"
            color={images.length===0?"secondary":"inherit"}
            component="label"
            style={{marginRight: "20px"}}
            onClick={() => {setImgLoad(true)}}
            endIcon={imgLoad?<CircularProgress size={20}/>:""}
          >
          {images.length===0?"Select Images":"Images Selected"}
            <input
              type="file"
              accept="image/*"
              multiple
              type="file"
              onChange={onFileChange}  
              hidden
            />
          </Button>
          {images.length===1?"1 file":images.length>1?`${images.length }files`:"0 files"} 
                  {fileError?<Alert style={{marginLeft: "20px"}} severity="error">Image is required!</Alert>:""}         
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add Product
          </Button>
        </form>
      </div>
      <Box mt={5}>
      </Box>
    </Container>
  )
}

export default AddProductForm