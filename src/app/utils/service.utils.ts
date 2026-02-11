import { Service } from '../store/models/booking.model';

/**
 * Service-related utility functions
 */
export class ServiceUtils {
  /**
   * Available services in the system
   * TODO: Move to backend API or configuration service
   * TODO: Differentiate pricing per service type when real pricing data becomes available
   *       Current uniform pricing (150/hr) is a placeholder
   */
  static readonly AVAILABLE_SERVICES: Service[] = [
    {
      id: '1',
      name: 'Cleaning',
      description: 'Professional cleaning services for your home',
      pricePerHour: 150,
    },
    {
      id: '2',
      name: 'Cooking',
      description: 'Expert cooking services',
      pricePerHour: 150,
    },
    {
      id: '3',
      name: 'Gardening',
      description: 'Garden maintenance services',
      pricePerHour: 150,
    }
  ];

  /**
   * Get emoji icon for a service name
   * @param serviceName Name of the service
   * @returns Emoji icon for the service
   */
  static getServiceIcon(serviceName: string): string {
    const icons: { [key: string]: string } = {
      'Cleaning': '🧹',
      'Cooking': '👨‍🍳',
      'Gardening': '🌱'
    };
    return icons[serviceName] || '🏠';
  }
}
