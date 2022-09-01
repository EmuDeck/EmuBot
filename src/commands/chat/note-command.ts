import { AddUndefinedToPossiblyUndefinedPropertiesOfInterface } from 'discord-api-types/utils/internals.js';
import {
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { Lang } from '../../services/index.js';
import { Logger } from '../../services/logger.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';
import { Notes, NotesCache, NotesConfig } from './notes.js';

export class NoteCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.note'),
        description: Lang.getRef('commandDescs.note', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: Lang.getCom('arguments.note'),
                required: true,
                description: Lang.getRef('argumentDescs.note', Lang.Default),
                choices: this.categories(NotesConfig, '', '/').concat(this.notes(NotesConfig)),
            },
        ],
    };
    private categories(
        notes: Notes,
        path: string,
        displayPath: string
    ): AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
        APIApplicationCommandOptionChoice<string>
    >[] {
        let options: AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
            APIApplicationCommandOptionChoice<string>
        >[] = [];
        for (const key in notes.categories) {
            for (const key2 in notes.categories[key].entries.notes) {
                options.push({
                    name:
                        displayPath +
                        notes.categories[key].name +
                        '/' +
                        notes.categories[key].entries.notes[key2].name,
                    value: path + key + '.' + key2,
                });
                NotesCache[path + key + '.' + key2] = notes.categories[key].entries.notes[key2];
            }
            this.categories(notes.categories[key].entries, path + '.', displayPath + '/');
        }
        return options;
    }
    private notes(
        notes: Notes
    ): AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
        APIApplicationCommandOptionChoice<string>
    >[] {
        let choices: AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
            APIApplicationCommandOptionChoice<string>
        >[] = [];
        for (const key in notes.notes) {
            Logger.info(key);
            choices.push({
                name: '/' + notes.notes[key].name,
                value: key,
            });
            NotesCache[key] = notes.notes[key];
        }
        return choices;
    }
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public async execute(intr: CommandInteraction): Promise<void> {
        let option = intr.options.getString(Lang.getCom('arguments.note'));

        let embed: MessageEmbed;
        embed = new MessageEmbed({
            title: NotesCache[option].name,
            description: NotesCache[option].answer,
        });

        await InteractionUtils.send(intr, embed);
    }
}
