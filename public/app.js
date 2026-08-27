let comments = [];

const commentArea = document.querySelector("#comment-area");
const inputBar = document.querySelector("#comment");
const commentBtn = document.querySelector("#comment-btn");

const addComment = function(inputVal) {
	if (inputVal === "") return;

	const commentPayload = {
		id: Date.now(),
		text: inputVal,
		like: 0,
		Children: [],
		isEditing: false,
		isReplying: false
	};
	comments.push(commentPayload);

	render();
}

commentBtn.addEventListener("click", () => {
	const inputValue = inputBar.value.trim();
	addComment(inputValue);
	inputBar.value = "";
	updateCommentBtnState();
});

inputBar.addEventListener("keydown", (event) => {
	if (event.key === "Enter") commentBtn.click();
});

inputBar.addEventListener("input", updateCommentBtnState);

function updateCommentBtnState() {
	commentBtn.disabled = inputBar.value.trim() === "";
}
updateCommentBtnState();

commentArea.addEventListener("click", (event) => {
	const likeBtnClicked = event.target.closest(".commentLikeBtn");
	const unlikeBtnClicked = event.target.closest(".commentUnlike");
	const editBtnClicked = event.target.closest(".commentEdit");
	const deleteBtnClicked = event.target.closest(".commentDelete");
	const childCommentClicked = event.target.closest(".createChildComment");
	const saveBtnClicked = event.target.closest(".saveComment");
	const cancelBtnClicked = event.target.closest(".cancelCommemt");
	const submitReplyClicked = event.target.closest(".submitReply");
	const cancelReplyClicked = event.target.closest(".cancelReply");

	const commentRow = event.target.closest(".comment-box");
	if (!commentRow) return;
	const commentId = Number(commentRow.dataset.id);

	if (likeBtnClicked) {
		likeOperation(commentId);
		return;
	}

	if (unlikeBtnClicked) {
		unlikeOperation(commentId);
		return;
	}

	if (editBtnClicked) {
		editOperation(commentId);
		return;
	}

	if (deleteBtnClicked) {
		deleteOperation(commentId);
		return;
	}

	if (childCommentClicked) {
		childCommentOperation(commentId);
		return;
	}

	if (saveBtnClicked) {
		saveOperation(commentId);
		return;
	}

	if (cancelBtnClicked) {
		cancelOperation(commentId);
		return;
	}

	if (submitReplyClicked) {
		submitReplyOperation(commentId);
		return;
	}

	if (cancelReplyClicked) {
		cancelReplyOperation(commentId);
		return;
	}
});

// Comments can nest arbitrarily deep, so lookups/removal walk the tree recursively.
function findComment(commentId, list = comments) {
	for (const comment of list) {
		if (comment.id === commentId) return comment;
		if (comment.Children.length) {
			const found = findComment(commentId, comment.Children);
			if (found) return found;
		}
	}
	return null;
}

function removeComment(commentId, list = comments) {
	const index = list.findIndex(comment => comment.id === commentId);
	if (index !== -1) {
		list.splice(index, 1);
		return true;
	}
	for (const comment of list) {
		if (comment.Children.length && removeComment(commentId, comment.Children)) {
			return true;
		}
	}
	return false;
}

function closeAllEditingAndReplying(list) {
	list.forEach(comment => {
		comment.isEditing = false;
		comment.isReplying = false;
		if (comment.Children.length) closeAllEditingAndReplying(comment.Children);
	});
}

function likeOperation(commentId) {
	const currComment = findComment(commentId);
	currComment.like = Number(currComment.like) + 1;

	render();
}

function unlikeOperation(commentId) {
	const currComment = findComment(commentId);
	currComment.like = Number(currComment.like) - 1;

	render();
}

function editOperation(commentId) {
	closeAllEditingAndReplying(comments);
	const currComment = findComment(commentId);
	if (currComment) currComment.isEditing = true;

	render();
}

function saveOperation(commentId) {
	const currComment = findComment(commentId);
	const editInput = document.querySelector("#editCommentInput").value.trim();
	if (editInput === "") return;

	currComment.text = editInput;
	currComment.isEditing = false;

	render();
}

function cancelOperation(commentId) {
	const currComment = findComment(commentId);
	if (currComment) currComment.isEditing = false;

	render();
}

function deleteOperation(commentId) {
	removeComment(commentId);
	render();
}

function childCommentOperation(commentId) {
	closeAllEditingAndReplying(comments);
	const currComment = findComment(commentId);
	if (currComment) currComment.isReplying = true;

	render();
}

function submitReplyOperation(commentId) {
	const currComment = findComment(commentId);
	const replyInput = document.querySelector("#replyCommentInput");
	const replyValue = replyInput.value.trim();
	if (replyValue === "") return;

	currComment.Children.push({
		id: Date.now(),
		text: replyValue,
		like: 0,
		Children: [],
		isEditing: false,
		isReplying: false
	});
	currComment.isReplying = false;

	render();
}

function cancelReplyOperation(commentId) {
	const currComment = findComment(commentId);
	if (currComment) currComment.isReplying = false;

	render();
}

function render() {
	commentArea.innerHTML = "";
	comments.forEach(comment => commentArea.appendChild(buildCommentNode(comment)));
	updateCommentBtnState();
}

function buildCommentNode(comment) {
	const div = document.createElement("div");
	div.classList.add("comment-box");
	div.dataset.id = comment.id;

	if (comment.isEditing) {
		div.appendChild(buildEditView(comment));
	} else {
		div.appendChild(buildReadView(comment));
	}

	if (comment.isReplying) {
		div.appendChild(buildReplyView());
	}

	if (comment.Children.length) {
		const childrenContainer = document.createElement("div");
		childrenContainer.classList.add("children-container");
		comment.Children.forEach(child => {
			childrenContainer.appendChild(buildCommentNode(child));
		});
		div.appendChild(childrenContainer);
	}

	return div;
}

function buildReadView(comment) {
	const fragment = document.createDocumentFragment();

	const span = document.createElement("span");
	span.classList.add("commentText");
	span.innerText = comment.text;

	const operationDiv = document.createElement("div");
	operationDiv.classList.add("operationDiv");

	const like = document.createElement("button");
	like.innerText = "▲";
	like.title = "Like";
	like.classList.add("commentLikeBtn", "iconBtn");

	const likeSpan = document.createElement("span");
	likeSpan.classList.add("likeCount");
	likeSpan.innerText = comment.like;

	const unlike = document.createElement("button");
	unlike.innerText = "▼";
	unlike.title = "Unlike";
	unlike.classList.add("commentUnlike", "iconBtn");

	const edit = document.createElement("button");
	edit.innerText = "Edit";
	edit.classList.add("commentEdit");

	const childComment = document.createElement("button");
	childComment.innerText = "Reply";
	childComment.classList.add("createChildComment");

	const del = document.createElement("button");
	del.innerText = "Delete";
	del.classList.add("commentDelete", "dangerBtn");

	operationDiv.append(like, likeSpan, unlike, edit, childComment, del);

	fragment.append(span, operationDiv);
	return fragment;
}

function buildEditView(comment) {
	const fragment = document.createDocumentFragment();

	const editInput = document.createElement("input");
	editInput.type = "text";
	editInput.value = comment.text;
	editInput.id = "editCommentInput";

	const operationDiv = document.createElement("div");
	operationDiv.classList.add("operationDiv");

	const save = document.createElement("button");
	save.innerText = "Save";
	save.classList.add("saveComment");

	const cancel = document.createElement("button");
	cancel.innerText = "Cancel";
	cancel.classList.add("cancelCommemt");

	operationDiv.append(save, cancel);
	fragment.append(editInput, operationDiv);

	queueMicrotask(() => editInput.focus());
	return fragment;
}

function buildReplyView() {
	const replyBox = document.createElement("div");
	replyBox.classList.add("reply-box");

	const replyInput = document.createElement("input");
	replyInput.type = "text";
	replyInput.placeholder = "Write a reply...";
	replyInput.id = "replyCommentInput";

	const replyOps = document.createElement("div");
	replyOps.classList.add("operationDiv");

	const submitReply = document.createElement("button");
	submitReply.innerText = "Reply";
	submitReply.classList.add("submitReply");

	const cancelReply = document.createElement("button");
	cancelReply.innerText = "Cancel";
	cancelReply.classList.add("cancelReply");

	replyOps.append(submitReply, cancelReply);
	replyBox.append(replyInput, replyOps);

	queueMicrotask(() => replyInput.focus());
	return replyBox;
}