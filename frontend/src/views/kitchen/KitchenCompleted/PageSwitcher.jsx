import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import clsx from "clsx";
import { useRef } from "react";

import styles from "./KitchenCompleted.module.css";
/**
 * Allows switching pages in the completed orders view using arrows or
 * direct numeric input.
 *
 * @function PageSwitcher
 * @param {Object} props
 * @param {number} props.pageNum - Current active page number.
 * @param {number} props.totalPages - Total number of pages.
 * @param {Function} props.setPageNum - Setter to update the page number.
 * @returns {React.ReactElement} A pagination control component.
 */
export default function PageSwitcher({ pageNum, totalPages, setPageNum }) {
    const inputRef = useRef(undefined);

    function safeChangePageNum(deltaPages) {
        if (pageNum + deltaPages >= 1  &&  pageNum + deltaPages <= totalPages) {
            setPageNum(p => p + deltaPages);
            inputRef.current.value = pageNum + deltaPages;
        } else {
            // Otherwise reset the <input>
            inputRef.current.value = pageNum;
        }
    }

    function safeSetPageNum(newPageNum) {
        if (newPageNum >= 1 && newPageNum <= totalPages) {
            setPageNum(newPageNum);
            inputRef.current.value = newPageNum;
        } else {
            // Otherwise reset the <input>
            inputRef.current.value = pageNum;
        }
    }

    function handleKeyDown(e) {
        // Commit on enter
        if (e.key === "Enter") {
            safeSetPageNum(Number.parseInt(inputRef.current.value));
            inputRef.current.blur();
        }
    }

    function handleBlur() {
        // Commit on blur (i.e. when the user "unselects" the <input>)
        safeSetPageNum(Number.parseInt(inputRef.current.value));
    }

    return (
        <div className={styles.pageSwitcher}>
            <FaArrowLeft className={clsx(styles.pageArrow, styles.pageArrowLeft)} onClick={() => safeChangePageNum(-1)} />
            <p className={styles.pagePrompt}>Page </p>
            <input ref={inputRef} defaultValue={pageNum} onBlur={handleBlur} onKeyDown={handleKeyDown} className={styles.pageInput} />
            <p className={styles.pagePrompt}> of {totalPages}</p>
            <FaArrowRight className={clsx(styles.pageArrow, styles.pageArrowRight)} onClick={() => safeChangePageNum(+1)} />
        </div>
    );
}
