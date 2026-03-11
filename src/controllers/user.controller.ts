import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { Config } from 'src/config/config.schema';
import { KafkaService } from 'src/services/kafka.service';
import { UserService } from 'src/services/user.service';

const USER_DELETE_TOPIC = 'user.delete';
const USER_DELETE_ERROR_TOPIC = 'dlt.user.delete.saju.core';

@Controller()
export class UserController {
  private readonly dltConfig: Config['eventBus']['dlt'];
  constructor(
    private readonly userService: UserService,
    private readonly kafkaService: KafkaService,
    private readonly config: ConfigService<Config, true>,
  ) {
    this.dltConfig = this.config.get('eventBus.dlt', { infer: true });
  }

  @EventPattern(USER_DELETE_TOPIC)
  async deleteUser(@Payload() message: { uuid: string }) {
    Logger.log(
      `Received delete user message for UUID ${message.uuid}`,
      'UserController',
    );
    await this.userService
      .deleteUser(message.uuid)
      .catch(async (err: Error) => {
        await this.kafkaService.emit(USER_DELETE_ERROR_TOPIC, {
          originTopic: USER_DELETE_TOPIC,
          retries: 0,
          data: message,
          error: err.message,
        });
        Logger.error(
          `Error deleting user with UUID ${message.uuid}: ${err.message} (retry 0)`,
          'UserController',
        );
      });
  }

  @EventPattern(USER_DELETE_ERROR_TOPIC)
  async handleDeleteUserError(
    @Payload()
    message: {
      originTopic: string;
      retries: number;
      data: { uuid: string };
      error: string;
    },
  ) {
    if (
      message.retries >= 0 &&
      message.retries < this.dltConfig.retry.maxAttempts
    ) {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, this.dltConfig.retry.delay),
        );
        await this.userService.deleteUser(message.data.uuid);
        Logger.log(
          `Successfully deleted user with UUID ${message.data.uuid} after retry ${message.retries}`,
          'UserController',
        );
      } catch (error) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        await this.kafkaService.emit(USER_DELETE_ERROR_TOPIC, {
          originTopic: message.originTopic,
          retries: message.retries + 1,
          data: message.data,
          error: errorMessage,
        });
        Logger.error(
          `Error deleting user with UUID ${message.data.uuid}: ${(error as Error).message} (retry ${message.retries})`,
          'UserController',
        );
      }
    } else {
      Logger.error(
        `Error deleting user with UUID ${message.data.uuid}: ${message.error} (retry ${message.retries})`,
        undefined,
        'UserController',
      );
    }
  }
}
