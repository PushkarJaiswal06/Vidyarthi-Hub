export default function GetAvgRating(ratingArr) {
    // Handle undefined, null, or empty arrays
    if (!ratingArr || ratingArr.length === 0) return 0
    
    const totalReviewCount = ratingArr.reduce((acc, curr) => {
      acc += curr.rating || 0
      return acc
    }, 0)
  
    const multiplier = Math.pow(10, 1)
    const avgReviewCount =
      Math.round((totalReviewCount / ratingArr.length) * multiplier) / multiplier
  
    return avgReviewCount
  }