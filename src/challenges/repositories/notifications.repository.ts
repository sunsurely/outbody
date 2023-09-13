import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsRepository extends Repository<Notification> {
  constructor(private readonly dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  // 알림 생성
  async createNotification(
    Notification: CreateNotificationDto,
  ): Promise<Notification> {
    const newNotification = await this.create(Notification);
    return await this.save(newNotification);
  }
}
