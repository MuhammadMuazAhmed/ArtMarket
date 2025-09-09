import React from 'react';
import styles from '../assets/AnimatedBackground.module.css';

const AnimatedBackground = () => {
  return (
    <>
      <div className={styles.animatedBackground} />
      <div 
        className={styles.backgroundImage1} 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1482160549825-59d1b23cb208?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')`
        }}
      />
      <div 
        className={styles.backgroundImage2}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`
        }}
      />
      <div 
        className={styles.backgroundImage3}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1460627390041-532a28402358?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`
        }}
      />
    </>
  );
};

export default AnimatedBackground;
