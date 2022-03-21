import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { SiNiconico } from "react-icons/si";
import { MdClose } from "react-icons/md";
import { DateTime } from "luxon";

function Channel(props) {
    let { id } = useParams();
    const [token, setToken] = useState("");
    const [channel, setChannel] = useState();
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);

    const [rating, setRating] = useState(0); //avg rating?
    const [numberOfRaters, setNumberOfRaters] = useState(0);
    const [ratersList, setRatersList] = useState([]);
    const [userid, setUserId] = useState();
    const [personalReviewData, setPersonalReviewData] = useState();
    const [reviewList, setReviewList] = useState([]);

    const [userReviewData, setUserReviewData] = useState([]);

    const [formRating, setFormRating] = useState();
    const [formReview, setFormReview] = useState();

    const [requestingRefresh, setRequestingRefresh] = useState(false);

    const [allTags, setAllTags] = useState([]);
    const [channelTags, setChannelTags] = useState([]);

    const [ytStatus, setYTStatus] = useState();
    const [twitterURL, setTwitterURL] = useState();
    const [niconicoURL, setNiconicoURL] = useState();
    const [ytAliases, setYTAliases] = useState();

    const [ytUpdateError, setYTUpdateError] = useState();

    const refreshComments = () => {
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/comment/" + id, {
                method: "GET",
                mode: "cors",
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json();
                    }
                })
                .then((res) => {
                    setCommentList(res.comments);
                });
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            setToken(localStorage.getItem("token"));
        }
        if (localStorage.getItem("id") !== null) {
            setUserId(localStorage.getItem("id"));
        }
    }, []);

    useEffect(() => {
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/channel/" + id + "/all", {
                method: "GET",
                mode: "cors",
            })
                .then((res) => res.json())
                .then((res) => {
                    document.title = res.channel.name;
                    setChannel(res.channel);
                    setYTStatus(res.channel.status);
                    setTwitterURL(res.channel.twitter);
                    setNiconicoURL(res.channel.niconico);
                    setYTAliases(res.channel.aliases);

                    let reviews = res.ratings;
                    let avgRating = 0;
                    let newRatingsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (let i = 0; i < reviews.length; i++) {
                        avgRating += reviews[i].rating;
                        newRatingsArray[reviews[i].rating]++;
                    }

                    reviews.sort((a, b) => {
                        return (
                            DateTime.fromISO(b.date).toMillis() -
                            DateTime.fromISO(a.date).toMillis()
                        );
                    });
                    if (reviews.length > 10) {
                        setReviewList(reviews.slice(0, 10));
                    } else {
                        setReviewList(reviews);
                    }
                    setRatersList(newRatingsArray);
                    if (reviews.length > 0) {
                        setRating(avgRating / reviews.length);
                    }
                    setNumberOfRaters(reviews.length);
                    setCommentList(res.comments);
                    setAllTags(res.allTags);
                    setChannelTags(res.channel.tags);
                });
        }
    }, [props.apiURL, id, userid, requestingRefresh, props.loggedIn]);

    useEffect(() => {}, [channel]);

    useEffect(() => {
        if (typeof userid !== "undefined" && reviewList.length > 0) {
            for (let i = 0; i < reviewList.length; i++) {
                if (reviewList[i].raterid._id === userid) {
                    setPersonalReviewData(reviewList[i]);
                    break;
                }
            }
        }
    }, [userid, reviewList]);

    const postComment = (e) => {
        e.preventDefault();
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/comment", {
                method: "POST",
                body: JSON.stringify({ channelid: id, comment: comment }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => {
                if (res.status === 200) {
                    refreshComments();
                }
            });
        }
    };

    const deleteComment = (id, authorid) => {
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/comment", {
                method: "DELETE",
                body: JSON.stringify({
                    authorid: authorid,
                    commentid: id,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => {
                if (res.status === 200) {
                    refreshComments();
                }
            });
        }
    };

    const submitReview = (e) => {
        e.preventDefault();
        let sendRating = 0;
        let sendReview = " ";
        if (typeof formRating === "undefined") {
            if (typeof personalReviewData !== "undefined") {
                sendRating = personalReviewData.rating;
            }
        } else {
            sendRating = formRating;
        }

        if (typeof formReview === "undefined") {
            if (typeof personalReviewData !== "undefined") {
                sendReview = personalReviewData.review;
            }
        } else {
            sendReview = formReview;
        }

        fetch(props.apiURL + "/channelrating/" + id, {
            method: "POST",
            body: JSON.stringify({
                rating: sendRating,
                review: sendReview,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            mode: "cors",
        }).then((res) => {
            if (res.status === 200) {
                setRequestingRefresh(!requestingRefresh);
            }
        });
    };

    const deleteReview = () => {
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/channelrating/" + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => {
                if (res.status === 200) {
                    setRequestingRefresh(!requestingRefresh);
                    Array.from(document.querySelectorAll("input")).forEach(
                        (input) => (input.value = "")
                    );
                    Array.from(document.querySelectorAll("textarea")).forEach(
                        (input) => (input.value = "")
                    );
                    setPersonalReviewData(-1);
                }
            });
        }
    };

    function addTag(e) {
        e.preventDefault();
        if (props.apiURL !== "") {
            let tagId = 0;
            let selectedTag = document.getElementById("tag").value;
            for (let i = 0; i < allTags.length; i++) {
                if (allTags[i].name === selectedTag) {
                    tagId = allTags[i]._id;
                }
            }

            if (tagId !== 0) {
                fetch(props.apiURL + "/channel/" + id + "/tag", {
                    method: "POST",
                    body: JSON.stringify({
                        tagid: tagId,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    mode: "cors",
                }).then((res) => {
                    setRequestingRefresh(!requestingRefresh);
                });
            } else {
            }
        }
    }

    function deleteTag(e, idToDelete) {
        e.preventDefault();
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/channel/" + id + "/tag", {
                method: "DELETE",
                body: JSON.stringify({
                    tagid: idToDelete,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => {
                setRequestingRefresh(!requestingRefresh);
            });
        }
    }

    function sendChannelEdits(e) {
        e.preventDefault();
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/channel/" + id, {
                method: "PUT",
                body: JSON.stringify({
                    status: ytStatus,
                    niconico: niconicoURL,
                    twitter: twitterURL,
                    aliases: ytAliases,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => setRequestingRefresh(!requestingRefresh));
        }
    }

    function refreshYTStats(e) {
        e.preventDefault();
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/channel/" + id + "/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => {
                if (res.status === 200) {
                    setRequestingRefresh(!requestingRefresh);
                } else {
                    setYTUpdateError(
                        "This channel has already been refreshed in the last 24 hours."
                    );
                }
            });
        }
    }

    return (
        <div className="container">
            {/* header */}
            <div className="row bg-light">
                <div className="col-12 col-lg-3 p-2 d-flex justify-content-center align-items-center">
                    {typeof channel === "undefined" ? null : (
                        <img
                            src={channel.imageurl}
                            alt={channel.name}
                            className="h-auto w-100 rounded-circle text-center"
                        ></img>
                    )}
                </div>
                <div
                    className="bg-light col-12 col-lg-8 p-3"
                    style={{ backgroundColor: "green" }}
                >
                    {typeof channel === "undefined" ? (
                        <div
                            className="spinner-border text-success"
                            role="status"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <h1>{channel.name}</h1>
                            {typeof channel.aliases !== "undefined" &&
                            channel.aliases !== channel.name &&
                            channel.aliases !== "" ? (
                                <p className="fs-4">
                                    Also Known As: {channel.aliases}
                                </p>
                            ) : null}
                            <p>Status: {channel.status}</p>
                            {typeof channel === "undefined" ? null : (
                                <div>
                                    <p># Channel Views: {channel.viewcount}</p>
                                    <p>
                                        # Uploaded Videos: {channel.videocount}
                                    </p>
                                </div>
                            )}

                            <div className="socials">
                                {typeof channel !== "undefined" &&
                                typeof channel.twitter !== "undefined" &&
                                channel.twitter !== "" ? (
                                    <a
                                        href={
                                            "https://twitter.com/" +
                                            channel.twitter
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaTwitter size="2em" />
                                    </a>
                                ) : null}
                                {typeof channel !== "undefined" &&
                                typeof channel.niconico !== "undefined" &&
                                channel.niconico !== "" ? (
                                    <a
                                        href={
                                            "https://ch.nicovideo.jp/" +
                                            channel.niconico
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <SiNiconico size="2em" color="gray" />
                                    </a>
                                ) : null}
                                <a
                                    href={
                                        "https://www.youtube.com/channel/" +
                                        channel.youtube
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaYoutube color="red" size="2em" />
                                </a>
                            </div>
                        </div>
                    )}
                    <hr />
                    {props.loggedIn === true ? (
                        <button
                            type="button"
                            className="btn btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#editForm"
                        >
                            Edit Channel Info
                        </button>
                    ) : null}
                    <button
                        type="button"
                        className="btn btn-success mx-3"
                        onClick={(e) => refreshYTStats(e)}
                    >
                        Refresh YouTube Stats
                    </button>
                    {typeof ytUpdateError !== "undefined" &&
                    ytUpdateError !== "" ? (
                        <p
                            className="mt-3"
                            style={{ color: "red", marginBottom: "0" }}
                        >
                            {ytUpdateError}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="row mt-3">
                <div
                    className="bg-light col-12  p-3"
                    style={{ backgroundColor: "green" }}
                >
                    <div>
                        <p className="fs-2 text-center">Tags</p>
                        <hr />
                        {allTags.length > 0 ? (
                            <form
                                className="mt-3 mb-3"
                                onSubmit={(e) => addTag(e)}
                            >
                                <label htmlFor="tag"></label>
                                <input list="tags" name="tag" id="tag" />
                                <datalist id="tags">
                                    {allTags.map((value, index) => {
                                        return (
                                            <option
                                                key={value._id}
                                                data-tag-id={value._id}
                                                value={value.name}
                                            ></option>
                                        );
                                    })}
                                </datalist>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Add Tag
                                </button>
                            </form>
                        ) : null}
                        {channelTags.length > 0
                            ? channelTags.map((value, index) => {
                                  return (
                                      <span className="" key={value._id}>
                                          <Link to={"/tag/" + value._id + "/1"}>
                                              {value.tagname}
                                          </Link>
                                          {props.loggedIn === true ? (
                                              <MdClose
                                                  color="red"
                                                  key={value._id}
                                                  size="1.5em"
                                                  cursor="pointer"
                                                  onClick={(e) =>
                                                      deleteTag(e, value._id)
                                                  }
                                              />
                                          ) : index + 1 !==
                                            channelTags.length ? (
                                              <span key={value._id}>, </span>
                                          ) : null}
                                      </span>
                                  );
                              })
                            : null}
                    </div>
                </div>
            </div>

            {/* stats */}
            <div className="row mt-3 bg-light" style={{ minHeight: "25vh" }}>
                <p className="text-center pt-3 fs-3 mb-0">Statistics</p>
                <hr />
                <div className="col-12 col-lg-6 p-3">
                    {ratersList.length > 0 ? (
                        <div>
                            <p className="text-center">Ratings</p>
                            {ratersList.map((value, index) => {
                                return (
                                    <div key={`review-count-${index}`}>
                                        <div
                                            className="progress mt-3"
                                            style={{ height: "1.7em" }}
                                        >
                                            <p>{index}:</p>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${
                                                        (value /
                                                            Math.max(
                                                                ...ratersList
                                                            )) *
                                                        100
                                                    }%`,
                                                }}
                                                aria-valuenow={value}
                                                aria-valuemin="0"
                                                aria-valuemax={Math.max(
                                                    ...ratersList
                                                )}
                                            >
                                                {value}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                    <hr />
                    <div className="text-center">
                        <p className="mt-3">
                            Average Rating:{" "}
                            {rating === 10 ? rating : rating.toFixed(1)}/10
                            (votes: {numberOfRaters})
                        </p>

                        <p>
                            Your Rating:{" "}
                            {typeof personalReviewData === "undefined" ||
                            personalReviewData === -1 ? (
                                "-"
                            ) : (
                                <span>
                                    {personalReviewData.rating}
                                    <MdClose
                                        cursor="pointer"
                                        color="red"
                                        size="1.5em"
                                        onClick={() => deleteReview()}
                                    />
                                </span>
                            )}
                        </p>

                        <button
                            type="button"
                            className="btn btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#reviewForm"
                        >
                            {typeof personalReviewData === "undefined" ||
                            personalReviewData === -1
                                ? "Add Review"
                                : "Edit Review"}
                        </button>
                    </div>
                </div>

                <div className="col-12 col-lg-6 d-flex flex-column align-items-center p-3">
                    <p>Recent Reviews</p>
                    {reviewList.length > 0 ? (
                        reviewList.map((value, index) => {
                            return (
                                <p
                                    key={`latest-reviews-${index}`}
                                    style={{ cursor: "pointer", color: "blue" }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#reviewShow"
                                    onClick={() =>
                                        setUserReviewData([
                                            value.review,
                                            value.rating,
                                            value.raterid.username,
                                        ])
                                    }
                                >
                                    {value.raterid.username} {value.rating}/10 -{" "}
                                    {DateTime.fromISO(value.date).toFormat(
                                        "yyyy LLL dd"
                                    )}
                                </p>
                            );
                        })
                    ) : (
                        <p>None</p>
                    )}
                </div>
            </div>

            {/* Modal Specific Review */}
            <div
                className="modal fade"
                id="reviewShow"
                tabIndex="-1"
                aria-labelledby="reviewShowLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reviewShowLabel">
                                {userReviewData[2]}'s review <br />
                                {userReviewData[1]}/10
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                {typeof userReviewData[0] !== "undefined"
                                    ? userReviewData[0]
                                    : "User did not write a review."}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Review */}
            <div
                className="modal fade"
                id="reviewForm"
                tabIndex="-1"
                aria-labelledby="reviewFormLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reviewFormLabel">
                                Review
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => submitReview(e)}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="reviewRating"
                                        className="form-label"
                                    >
                                        Rating
                                    </label>
                                    <div className="input-group">
                                        {typeof personalReviewData ===
                                        "undefined" ? (
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="reviewRating"
                                                required
                                                onChange={(e) =>
                                                    setFormRating(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0-10"
                                                min="0"
                                                max="10"
                                            />
                                        ) : (
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="reviewRating"
                                                required
                                                onChange={(e) =>
                                                    setFormRating(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="7"
                                                defaultValue={
                                                    personalReviewData.rating
                                                }
                                                min="0"
                                                max="10"
                                            />
                                        )}

                                        <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                        >
                                            /10
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="reviewText"
                                        className="form-label"
                                    >
                                        Review
                                    </label>
                                    {typeof personalReviewData ===
                                    "undefined" ? (
                                        <textarea
                                            className="form-control"
                                            id="reviewText"
                                            onChange={(e) =>
                                                setFormReview(e.target.value)
                                            }
                                            rows="3"
                                            placeholder="optional"
                                            maxLength="1000"
                                        ></textarea>
                                    ) : (
                                        <textarea
                                            className="form-control"
                                            id="reviewText"
                                            onChange={(e) =>
                                                setFormReview(e.target.value)
                                            }
                                            rows="3"
                                            placeholder="optional"
                                            defaultValue={
                                                personalReviewData.review
                                            }
                                            maxLength="1000"
                                        ></textarea>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-3 float-end"
                                >
                                    Post Review
                                </button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit */}
            <div
                className="modal fade"
                id="editForm"
                tabIndex="-1"
                aria-labelledby="editFormLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reviewFormLabel">
                                Info
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => sendChannelEdits(e)}>
                                <label htmlFor="status">YouTube Status:</label>
                                <select
                                    className="form-select"
                                    aria-label="Activity Select"
                                    required
                                    id="status"
                                    value={ytStatus}
                                    onChange={(e) =>
                                        setYTStatus(e.target.value)
                                    }
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Unknown">Unknown</option>
                                </select>

                                <label htmlFor="twitter" className="form-label">
                                    Twitter:
                                </label>
                                <div className="input-group mb-3">
                                    <span
                                        className="input-group-text"
                                        id="basic-addon3"
                                    >
                                        @
                                    </span>
                                    {typeof twitterURL !== "undefined" ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="twitter"
                                            aria-describedby="basic-addon3"
                                            defaultValue={twitterURL}
                                            onChange={(e) =>
                                                setTwitterURL(e.target.value)
                                            }
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="twitter"
                                            aria-describedby="basic-addon3"
                                            onChange={(e) =>
                                                setTwitterURL(e.target.value)
                                            }
                                        />
                                    )}
                                </div>

                                <label htmlFor="nnd" className="form-label">
                                    Niconico:
                                </label>
                                <div className="input-group mb-3">
                                    <span
                                        className="input-group-text"
                                        id="basic-addon3"
                                    >
                                        https://ch.nicovideo.jp/
                                    </span>
                                    {typeof niconicoURL !== "undefined" ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nnd"
                                            aria-describedby="basic-addon3"
                                            defaultValue={niconicoURL}
                                            onChange={(e) =>
                                                setNiconicoURL(e.target.value)
                                            }
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nnd"
                                            aria-describedby="basic-addon3"
                                            onChange={(e) =>
                                                setNiconicoURL(e.target.value)
                                            }
                                        />
                                    )}
                                </div>

                                <label htmlFor="alias" className="form-label">
                                    Aliases:
                                </label>
                                {typeof ytAliases !== "undefined" ? (
                                    <textarea
                                        className="form-control"
                                        id="alias"
                                        rows="3"
                                        defaultValue={ytAliases}
                                        onChange={(e) =>
                                            setYTAliases(e.target.value)
                                        }
                                    ></textarea>
                                ) : (
                                    <textarea
                                        className="form-control"
                                        id="alias"
                                        rows="3"
                                        onChange={(e) =>
                                            setYTAliases(e.target.value)
                                        }
                                    ></textarea>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-3 float-end"
                                >
                                    Submit Changes
                                </button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* comment section */}
            <div className="row mt-3 mb-3">
                <div
                    className="col-12 bg-light"
                    style={{ backgroundColor: "green" }}
                >
                    <form onSubmit={postComment}>
                        <label
                            htmlFor="comment-form"
                            className="form-label mt-3"
                        >
                            Add a comment
                        </label>
                        <textarea
                            className="form-control mb-3"
                            id="comment-form"
                            rows="3"
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>
                    <hr />
                    <p className="fs-2 text-center">Comments</p>
                    <div className="comment-area">
                        {typeof commentList !== "undefined" &&
                        commentList.length > 0 ? (
                            commentList.map((value, index) => {
                                return (
                                    <div key={value.authorid._id + index}>
                                        <p className="fs-2 fw-bold">
                                            {value.authorid.username}
                                            <span className="fs-5 fw-normal">
                                                {" "}
                                                {DateTime.fromISO(
                                                    value.date
                                                ).toFormat("yyyy LLL dd")}
                                            </span>

                                            {typeof userid !== "undefined" &&
                                            value.authorid._id === userid ? (
                                                <MdClose
                                                    color="red"
                                                    cursor="pointer"
                                                    size="1.3em"
                                                    style={{ float: "right" }}
                                                    onClick={() =>
                                                        deleteComment(
                                                            value._id,
                                                            value.authorid._id
                                                        )
                                                    }
                                                />
                                            ) : null}
                                        </p>
                                        <p
                                            className="fs-5"
                                            style={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {value.comment}
                                        </p>
                                        {index !== commentList.length - 1 ? (
                                            <hr />
                                        ) : null}
                                    </div>
                                );
                            })
                        ) : (
                            <p>No comments</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Channel;
