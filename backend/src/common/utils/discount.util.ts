export class DiscountUtil {
  
  /**
   * Convert discount to percentage for invoice calculations
   * @param discountValue - The discount value (40 or 10000)
   * @param discountType - 'percentage' or 'fixed'
   * @param basePrice - DB price of service
   * @param quantity - Number of items
   * @returns Percentage value (40) or converted percentage (16.67)
   */
  static convertToPercentage(
    discountValue: number,
    discountType: 'percentage' | 'fixed',
    basePrice: number,
    quantity: number = 1,
  ): number {
    if (!discountValue || discountValue <= 0) {
      return 0;
    }

    if (discountType === 'percentage') {
      // Already percentage - just return as is
      return Math.min(discountValue, 100);
    }

    // Fixed amount - convert to percentage
    const totalBase = basePrice * quantity;
    
    if (totalBase <= 0) {
      return 0;
    }

    const percentage = (discountValue / totalBase) * 100;
    return Math.min(percentage, 100);
  }

  /**
   * Convert discount to fixed amount
   * @param discountValue - The discount value (40 or 10000)
   * @param discountType - 'percentage' or 'fixed'
   * @param basePrice - DB price of service
   * @param quantity - Number of items
   * @returns Fixed amount (24000 or 10000)
   */
  static convertToAmount(
    discountValue: number,
    discountType: 'percentage' | 'fixed',
    basePrice: number,
    quantity: number = 1,
  ): number {
    if (!discountValue || discountValue <= 0) {
      return 0;
    }

    if (discountType === 'fixed') {
      // Already fixed amount
      const maxDiscount = basePrice * quantity;
      return Math.min(discountValue, maxDiscount);
    }

    // Percentage - convert to amount
    const totalBase = basePrice * quantity;
    const percentage = Math.min(discountValue, 100);
    return (totalBase * percentage) / 100;
  }

  /**
   * Validate if discount is valid
   */
  static validateDiscount(
    discountValue: number,
    discountType: 'percentage' | 'fixed',
    basePrice: number,
    quantity: number = 1,
  ): { isValid: boolean; message?: string } {
    if (discountValue < 0) {
      return { isValid: false, message: 'Discount cannot be negative' };
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return { isValid: false, message: 'Percentage discount cannot exceed 100%' };
    }

    if (discountType === 'fixed') {
      const maxDiscount = basePrice * quantity;
      if (discountValue > maxDiscount) {
        return { 
          isValid: false, 
          message: `Fixed discount cannot exceed total price of ${maxDiscount}` 
        };
      }
    }

    return { isValid: true };
  }
}