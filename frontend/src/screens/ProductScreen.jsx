
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, Card, ListGroup, Button, ListGroupItem, Form } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import Rating from "../components/Rating"
import { createProductReview, listProductDetails } from "../actions/productActions"
import Message from '../components/Message'
import Loader from '../components/Loader'
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants"
import Meta from "../components/Meta"


const ProductScreen = () => {

    const navigate = useNavigate()
    const params = useParams()
    const productId = params.id
    const dispatch = useDispatch()

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const productDetails = useSelector(state => state.productDetails)
    const { isLoading, isError, product } = productDetails

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { isSuccess: isSuccessProductReview, isError: isErrorProductReview, isLoading: isLoadingProductReview } = productReviewCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        if (isSuccessProductReview) {
            setRating(0)
            setComment('')
        }
        if (!product._id || product._id !== productId) {
            dispatch(listProductDetails(productId))
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        dispatch(listProductDetails(productId))
    }, [dispatch, product._id, productId, isSuccessProductReview])


    const addToCartHandler = () => {
        navigate(`/cart/${productId}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(productId, {
            rating,
            comment
        }))
    }



    return (
        <>
            <Link className="btn btn-light my-3" to='/'>
                Go Back
            </Link>
            {isLoading ? (<Loader />) : isError ? (<Message variant='danger' >{isError}</Message>) : (
                <>
                <Meta title={product.name}/>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h3>{product.name}</h3>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Rating
                                        value={product.rating}
                                        text={`${product.numReviews} reviews`}
                                    />
                                </ListGroupItem>
                                <ListGroupItem>
                                    Price: ${product.price}
                                </ListGroupItem>
                                <ListGroupItem>
                                    Description: {product.description}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>
                                                Price:
                                            </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <Row>
                                            <Col>
                                                Status:
                                            </Col>
                                            <Col>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroupItem>

                                    {product.countInStock > 0 && (
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Quantity</Col>
                                                <Col>
                                                    <Form.Control
                                                        as='select'
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                    >
                                                        {[...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}


                                    <ListGroupItem>
                                        <Button
                                            onClick={addToCartHandler}
                                            className="btn-block"
                                            type="button"
                                            disabled={product.countInStock === 0}
                                        >
                                            Add To Cart
                                        </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h3>Reviews</h3>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h3>Write a Customer Review</h3>
                                    {isSuccessProductReview && (
                                        <Message variant='success'>
                                            Review submitted successfully
                                        </Message>
                                    )}
                                    {isLoadingProductReview && <Loader />}
                                    {isErrorProductReview && (<Message variant='danger'>{isErrorProductReview}</Message>)}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating' className='mb-3'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value='' > Select... </option>
                                                    <option value='1' >1 - Poor </option>
                                                    <option value='2' >2 - Fair </option>
                                                    <option value='3' >3 - Good </option>
                                                    <option value='4' >4 - Very Good </option>
                                                    <option value='5' >5 - Excellent </option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment' className='mb-3'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button
                                                disabled={isLoadingProductReview}
                                                type='submit'
                                                variant='primary'
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message>
                                            Please <Link to='/login'> sign in </Link> to write a review {' '}
                                        </Message>)}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}

        </>

    )
}

export default ProductScreen