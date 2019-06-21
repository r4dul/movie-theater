import { useEffect, useState } from "react";

const styles = {
  navigationSm: 600,
  navigationMd: 1024
};

const isSticky = (scroll, target = styles.navigationMd - styles.navigationSm) =>
  scroll > target;

const calcPosition = (
  scroll,
  height = document.body.scrollHeight - window.innerHeight
) => ((scroll / height) * 100) | 0;

const useScrollStatus = (scroll = window.scrollY) => {
  const [stickyState, setStickyState] = useState(isSticky(scroll));
  const [positionState, setPositionState] = useState(calcPosition(scroll));

  function handleScrollChange() {
    setStickyState(isSticky(window.scrollY));
    setPositionState(calcPosition(window.scrollY));
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScrollChange);

    return function cleanup() {
      window.removeEventListener("scroll", handleScrollChange);
    };
  }, []);

  return {
    sticky: stickyState,
    position: positionState
  };
};

export default useScrollStatus;
