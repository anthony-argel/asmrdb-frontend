import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Tags = (props) => {
    const [newTagName, setNewTagName] = useState("");
    const [newTagDescription, setNewTagDescription] = useState("");
    const [newTagReason, setNewTagReason] = useState("");
    const [token, setToken] = useState("");
    const [approvedTags, setApprovedTags] = useState([]);
    const [waitingTags, setWaitingTags] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        document.title = "Tags | ASMRdb";
        if (localStorage.getItem("token") !== null) {
            setToken(localStorage.getItem("token"));
        }

        if (props.apiURL !== "") {
            fetch(props.apiURL + "/tag", {
                method: "GET",
                mode: "cors",
            })
                .then((res) => res.json())
                .then((res) => {
                    setApprovedTags(
                        res.approved.sort((a, b) => {
                            return a.name > b.name;
                        })
                    );
                    setWaitingTags(res.waiting);
                });
        }
    }, [props.apiURL, refresh]);

    useEffect(() => {}, [approvedTags]);

    function submitNewTag(e) {
        e.preventDefault();
        if (props.apiURL !== "") {
            fetch(props.apiURL + "/tag", {
                method: "POST",
                body: JSON.stringify({
                    name: newTagName,
                    description: newTagDescription,
                    reason: newTagReason,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                mode: "cors",
            }).then((res) => {
                if (res.status === 200) {
                    setRefresh(!refresh);
                    alert("sent");
                }
            });
        }
    }

    function closeForm(e) {
        e.preventDefault();
        Array.from(document.querySelectorAll("input")).forEach(
            (input) => (input.value = "")
        );
        Array.from(document.querySelectorAll("textarea")).forEach(
            (input) => (input.value = "")
        );
        setNewTagName("");
        setNewTagDescription("");
        setNewTagReason("");
    }

    return (
        <div className="container mb-3">
            <div className="row bg-light">
                <div className="col-12 col-lg-2 p-2 text-center">
                    <button
                        type="button"
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#tagModal"
                    >
                        Add A New Tag
                    </button>
                </div>
                <div className="col-12 col-lg-5 p-2 text-center">
                    <h1>Tags</h1>
                    <hr />

                    {approvedTags.length > 0 ? (
                        approvedTags.map((value, index) => {
                            return (
                                <p key={value._id}>
                                    <Link to={"/tag/" + value._id + "/1"}>
                                        {value.name}
                                    </Link>
                                </p>
                            );
                        })
                    ) : (
                        <div
                            className="spinner-border text-success"
                            role="status"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                </div>

                <div className="col-12 col-lg-5 p-2 text-center">
                    <h1>Waiting Approval</h1>
                    <hr />
                    {waitingTags.length > 0 ? (
                        waitingTags.map((value, index) => {
                            return <p key={value._id}>{value.name}</p>;
                        })
                    ) : (
                        <p>None</p>
                    )}
                </div>
            </div>

            <div
                className="modal fade"
                id="tagModal"
                tabIndex="-1"
                aria-labelledby="tagModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="tagModalLabel">
                                Add a Tag
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => submitNewTag(e)}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="tag-name"
                                        className="form-label"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="string"
                                        className="form-control"
                                        id="tag-name"
                                        required
                                        onChange={(e) =>
                                            setNewTagName(e.target.value)
                                        }
                                    ></input>
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="tag-description"
                                        className="form-label"
                                    >
                                        Description:
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="tag-description"
                                        rows="3"
                                        onChange={(e) =>
                                            setNewTagDescription(e.target.value)
                                        }
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="tag-reason"
                                        className="form-label"
                                    >
                                        Reasoning for adding:
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="tag-reason"
                                        rows="3"
                                        onChange={(e) =>
                                            setNewTagReason(e.target.value)
                                        }
                                    ></textarea>
                                </div>

                                <button
                                    type="button mt-3 float-end"
                                    className="btn btn-primary"
                                >
                                    Submit Tag
                                </button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={(e) => closeForm(e)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tags;
