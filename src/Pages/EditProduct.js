import React,{useEffect, useState, useRef} from 'react'
//import LoadingOverlay from "react-loading-overlay";
import { useParams } from "react-router-dom";
import { getSubCategory, getVerticalCategory, getCategory, getProductDetail, editProduct } from "../AppApi";
import Avatar from '@material-ui/core/Avatar';
//import ImageEditList from '../Component/ImageEditList'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';


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
    boxSizing: "content-box",
    borderColor: "",
    borderWidth: ""
  },
    filebtn:{
    display: "flex",
    alignItems: "center"
  }
}));


const EditformMiddleware = () => {
    const [proData, setproData] = useState()
    const {id} = useParams();
    useEffect(() => {
      async function fetchData() {  
        const pro = await getProductDetail(id);
        setproData(pro.data.data)
      }
      fetchData();
   }, []);

    return(
      <div>
      {proData ? <EditProductForm proData={proData}/> : <CircularProgress />}
      </div>
    )
}


const EditProductForm = (props) => {
  const {id} = useParams();
  const [name, setName] = useState(props.proData.name);
  const [price, setPrice] = useState(props.proData.price);
  const [moq, setMoq] = useState(props.proData.moq);  
  const [description, setDiscription] = useState(props.proData.description);
  const [categoryId, setCategoryId] = useState(props.proData.category_id);
  const [subCategoryId, setSubCategoryId] = useState(props.proData.sub_category_id);
  const [verticalId, setVerticalId] = useState(props.proData.vertical_id);
  const [images, setImages] = useState([]);

  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [verticalData, setVerticalData] = useState([]);

  const isFirstRun = useRef(true);

  const classes = useStyles();


  useEffect(() => {
      async function fetchData() {  
        const cat1 = await getCategory();
        setCategoryData(cat1.data.data);

        const cat2 = await getSubCategory(categoryId);
        setSubCategoryData(cat2.data.data);
        
        const cat3 = await getVerticalCategory(subCategoryId);
        setVerticalData(cat3.data.data)
      }
      fetchData();
   }, []);
        
  console.log(props.proData)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

      setSubCategoryId(0);
      setVerticalId(0);

      async function fetchData() {  
        const cat2 = await getSubCategory(categoryId);
        setSubCategoryData(cat2.data.data);
        console.log(cat2)
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
    console.log(event.target.value)
  };

  const onFileChange = event => {
    setImages(event.target.files)
    console.log(event.target.files)
  };

  const handleSubmit = (e) => {
    var dataset = {
      "id" : id,
      "name" : name,
      "desc" : description,
      "moq" : moq,
      "price" : price,
      "categoryId" : categoryId,
      "subCategoryId" : subCategoryId,
      "verticalId" : verticalId
    }
    editProduct(dataset,images);    
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Edit Product #{id}
        </Typography>
            <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                variant="outlined"
                required
                defaultValue={props.proData.name}
                fullWidth
                onChange={(e) => {
                  console.log(e.target.value);
                  setName(e.target.value);
                }}
                id="name"
                label="Product Title Name"
              />
            </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
              id="description"
              required
              defaultValue={props.proData.description}
              fullWidth
              label="Product Details"
              multiline
              rows={3}
              onChange={(e) => {
                console.log(e.target.value);
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
                defaultValue={props.proData.moq}
                onChange={(e) => {
                  console.log(e.target.value);
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
                defaultValue={props.proData.price}      
                type="number"
                onChange={(e) => {
                  console.log(e.target.value);
                  setPrice(e.target.value);
                }}    
                name="price"
              />
            </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="categoryId"
              select              
              fullWidth
              defaultValue={props.proData.category_id}
              label="Category"
              onChange={(e) => {console.log(e.target.value);setCategoryId(e.target.value)}}
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
              defaultValue={props.proData.sub_category_id}
              label="Subcategory"
              onChange={(e) => {console.log(e.target.value); setSubCategoryId(e.target.value)}}
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
              defaultValue={props.proData.vertical_id}
              label="Section"
              onChange={(e) => {console.log(e.target.value);setVerticalId(e.target.value)}}
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
            color="secondary"
            component="label"
          >
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              type="file"
              onChange={onFileChange}  
              hidden
            />
          </Button>
                   
            </Grid>
          </Grid>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update Product
          </Button>
        </form>      
      </div>
      <Box mt={5}>
        {/*<ImageEditList images={props.proData.images} />*/}
      </Box>
    </Container>
  )
}

export default EditformMiddleware